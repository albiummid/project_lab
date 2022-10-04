import { Schema, model, models } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [50, 'Your name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      validate: [validator.isEmail, 'Please enter valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Your password must be longer than 6 characters'],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    teams: [
      {
        type: Schema.ObjectId,
        ref: 'Team',
        required: true,
      },
    ],
  },

  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}

let User = models.User || model('User', userSchema)

export default User
