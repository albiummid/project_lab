import cloudinary from 'cloudinary'
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../app/constants'

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

export const CloudinaryUploader = async (data) => {
  return await cloudinary.v2.uploader.upload(data)
}
export const CloudinaryDestroyer = async (data) => {
  return await cloudinary.v2.uploader.destroy(data)
}
