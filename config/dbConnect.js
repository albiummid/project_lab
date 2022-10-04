import mongoose from 'mongoose'

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  mongoose
    .connect(process.env.DB_LOCAL_URI, {})
    .then((con) => console.log(`Connected to local database`))
    .catch((err) => {
      console.log('GOT an Error : ', err)
    })
}

export default dbConnect
