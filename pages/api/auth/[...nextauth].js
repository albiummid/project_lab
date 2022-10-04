import NextAuth from 'next-auth/next'
import Credentials from 'next-auth/providers/credentials'

import User from '../../../models/user'
import dbConnect from '../../../config/dbConnect'

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        dbConnect()
        const { email, password } = credentials

        // Check if email and password is entered

        if (!email || !password) {
          throw new Error('Please enter email or password')
        }

        // find user in the database
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
          throw new Error('Invalid Email or Password')
        }

        // check if pawword is correct or not
        const isPasswordMatched = await user.comparePassword(password)

        if (!isPasswordMatched) {
          throw new Error('Invalid Email or Password')
        }

        return Promise.resolve(user)
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return Promise.resolve(token)
    },
    session: async ({ session, token }) => {
      let user = token.user
      delete user.password
      session.user = user
      return Promise.resolve(session)
    },
  },
})
