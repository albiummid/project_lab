import User from '../models/user'
import ErrorHandler from '../utils/errorHandler'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import APIFeatures from '../utils/apiFeatures'
import Cloudinary from '../config/cloudinary'
import { CloudinaryUploader, CloudinaryDestroyer } from '../config/cloudinary'
import { renderToHTML } from 'next/dist/server/render'

// Register user => /api/auth/register
export const registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body
  const uploadResult = await CloudinaryUploader(req.body.avatar, {
    folder: 'teamlab/avatars',
    width: '150',
    crop: 'scale',
  })

  await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: uploadResult.public_id,
      url: uploadResult.url,
    },
  })
  res.status(200).json({
    success: true,
    message: 'Account registered successfully !',
  })
})

// Cuurent user profile   =>   /api/me
export const currentUserProfile = catchAsyncErrors(async (req, res) => {
  let user = await User.findById(req.user._id)

  if (user?.teams?.length) {
    console.log(user.teams, 'teams')
    user = await User.findById(req.user._id).populate('teams')
  }

  res.status(200).json({
    success: true,
    user,
  })
})

// Get Users =>
export const getUsers = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new APIFeatures(User.find().limit(5), req.query).search()
  let users = await apiFeatures.result

  if (!users) {
    return next(new ErrorHandler('No user found !', 404))
  }
  res.status(200).json({
    success: true,
    users,
  })
})

// Update user profile   =>   /api/me/update
export const updateProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name
    user.email = req.body.email

    if (req.body.password) user.password = req.body.password
  }

  // Update avatar
  if (req.body.avatar !== '') {
    const image_id = user.avatar.public_id

    // Delete user previous image/avatar
    await CloudinaryDestroyer(image_id)

    const result = await CloudinaryUploader(req.body.avatar, {
      folder: 'bookit/avatars',
      width: '150',
      crop: 'scale',
    })

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    }
  }

  await user.save()

  res.status(200).json({
    success: true,
  })
})

// Forgot password   =>   /api/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Get origin
  const { origin } = absoluteUrl(req)

  // Create reset password url
  const resetUrl = `${origin}/password/reset/${resetToken}`

  const message = `Your password reset url is as follow: \n\n ${resetUrl} \n\n\ If you have not requested this email, then ignore it.`

  try {
    await sendEmail({
      email: user.email,
      subject: 'BookIT Password Recovery',
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
})

// Reset password   =>   /api/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.query.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400
      )
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }

  // Setup the new password
  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  })
})

// Get all users   =>   /api/admin/users
export const allAdminUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users,
  })
})

// Get user details  =>   /api/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.query.id)

  if (!user) {
    return next(new ErrorHandler('User not found with this ID.', 400))
  }

  res.status(200).json({
    success: true,
    user,
  })
})

// Update user details  =>   /api/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  await User.findByIdAndUpdate(req.query.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// Delete user    =>   /api/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.query.id)

  if (!user) {
    return next(new ErrorHandler('User not found with this ID.', 400))
  }

  // Remove avatar
  const image_id = user.avatar.public_id
  await CloudinaryDestroyer(image_id)

  await user.remove()

  res.status(200).json({
    success: true,
    user,
  })
})
