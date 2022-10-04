import Team from '../models/team'
import User from '../models/user'
import ErrorHandler from '../utils/errorHandler'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import APIFeatures from '../utils/apiFeatures'
import { fieldsComparer, JSONComparer } from '../utils/utils'

export const newTeam = catchAsyncErrors(async (req, res, next) => {
  const team = await Team.create(req.body)
  let user = await User.findById(req.body.createdBy).exec()
  // Adding team id to user
  if (Array.isArray(user?.teams)) {
    user.teams.push(team.id)
  } else {
    user.teams = [team.id]
  }
  await user.save()
  res.status(200).json({
    success: true,
    team,
  })
})

export const allTeams = catchAsyncErrors(async (req, res, next) => {
  const limit = req.query.limit || 6
  const teamCount = await Team.countDocuments()
  const userPopulate = {
    path: 'members',
    populate: {
      path: 'user',
      model: 'User',
    },
  }

  const apiFeatures = new APIFeatures(
    Team.find().populate(userPopulate),
    req.query
  ).search()

  let teams = await apiFeatures.result
  let filteredTeamCount = teams.length

  // After filtering and getting length of filtered data , serving pagination data..
  if (req?.query?.page) {
    let resPagination = new APIFeatures(
      Team.find().populate(userPopulate),
      req.query
    )
      .search()
      .pagination(limit)
    teams = await resPagination.result

    return res.status(200).json({
      success: true,
      count: teamCount,
      filteredTeamCount,
      resPerPage,
      teams,
    })
  }
  res.status(200).json({
    success: true,
    count: teams.length,
    teams,
  })
})

export const getSingleTeam = catchAsyncErrors(async (req, res, next) => {
  const team = await Team.findById(req.query.id)

  if (!team) {
    return next(new ErrorHandler('Team not found with this ID', 404))
  }
  res.status(200).json({
    success: true,
    team,
  })
})

export const updateSingleTeam = catchAsyncErrors(async (req, res, next) => {
  let team = await Team.findById(req.query.id)

  if (!team) {
    return next(new ErrorHandler('Team not found with this ID', 404))
  }

  let changes = fieldsComparer(team, req.body)
  team = await Team.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  })

  // if (changes.members) {
  //   let members = req.body.members
  //   let lastIndex = members.length - 1
  //   let userId = members[lastIndex]

  //   const user = await User.findById(userId)
  //   if (!user) {
  //     return new ErrorHandler('Invalid user added to the team', 400)
  //   }
  //   if (Array.isArray(user?.teams)) {
  //     user.teams.push(team._id)
  //   } else {
  //     user.teams = [team._id]
  //   }
  // }

  res.status(200).json({
    success: true,
    team,
  })
})
export const addTeamMember = catchAsyncErrors(async (req, res, next) => {
  const { id, memberId } = req.query

  let team = await Team.findById(id)
  let user = await User.findById(memberId)

  if (!team) {
    return next(new ErrorHandler('Team not found with this ID', 404))
  }

  // Adding member to the team
  team.members.push({
    user: memberId,
  })
  await team.save()

  // Adding team id to user
  if (Array.isArray(user?.teams)) {
    user.teams.push(team.id)
  } else {
    user.teams = [team.id]
  }
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Team member added successfully !',
    team,
  })
})
export const removeTeamMember = catchAsyncErrors(async (req, res, next) => {
  const { id, memberId } = req.query

  let team = await Team.findById(id)
  let user = await User.findById(memberId)

  if (!team) {
    return next(new ErrorHandler('Team not found with this ID', 404))
  }

  let isValid = false
  team.members.forEach((item) => {
    if (item.user._id.toString() === memberId) {
      if (item.isCreator) {
        isValid = false
      } else {
        isValid = true
      }
    }
  })

  if (!isValid) {
    return next(
      new ErrorHandler("You can't remove creator from the team !", 400)
    )
  }

  let updatedMembers = team.members.filter(
    (item) => item.user._id.toString() !== memberId
  )
  team.members = updatedMembers
  await team.save()

  let updatedTeams = user.teams.filter((item) => item.toString() === id)
  user.teams = updatedTeams
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Team member removed successfully !',
    team,
  })
})

export const deleteSingleTeam = catchAsyncErrors(async (req, res, next) => {
  let team = await Team.findById(req.query.id)

  if (!team) {
    return next(new ErrorHandler('Team not found with this ID', 404))
  }
  team = await team.remove()
  res.status(200).json({
    success: true,
    message: 'Team deleted !',
  })
})

export const test = catchAsyncErrors(async (req, res, next) => {
  const query = { ...req.query }
  const orderKeys = ['_sort', '_order', '_start', '_end']
  const relationKeys = ['_like', '_gte', '_lte']
  const nestedKeys = ['.']

  const nestedQueries = {}
  const orderQueries = {}
  const relationQueries = {}

  let queryCopy = { ...query }

  Object.keys(queryCopy).forEach((key) => {
    let isOrderKey = orderKeys.findIndex((item) => item === key) !== -1
    if (isOrderKey) {
      delete queryCopy[key]
      return (orderQueries[key] = query[key])
    }

    let isRelationKey =
      relationKeys.findIndex((item) => key.includes(item)) !== -1
    if (isRelationKey) {
      delete queryCopy[key]
      return (relationQueries[key] = query[key])
    }
    let isNestedKey = nestedKeys.findIndex((item) => key.includes(item)) !== -1
    if (isNestedKey) {
      delete queryCopy[key]
      return (nestedQueries[key] = query[key])
    }
  })
  res.json({
    success: true,
    queries: req.query,
    queryCopy,
    nestedQueries,
    relationQueries,
    orderQueries,
  })
})
