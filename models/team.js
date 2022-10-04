import { model, models, Schema } from 'mongoose'

const teamSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required '],
      trim: true,
      maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required '],
      trim: true,
      maxLength: [400, 'Description cannot exceed 400 characters'],
    },
    color: {
      type: String,
      required: true,
    },

    members: [
      {
        user: {
          type: Schema.ObjectId,
          ref: 'User',
          required: true,
        },
        isCreator: {
          type: Boolean,
          required: true,
          default: false,
        },
        approved: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default models?.Team || model('Team', teamSchema)
