import { apiSlice } from '../api/apiSlice'

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (email) => `/users?email=${email}`,
    }),
    getUsers: builder.query({
      query: ({ email, name }) => {
        let queryStr = `/users?`
        let str = []
        if (email) {
          str.push(`email_like=${email}`)
        }
        if (name) {
          str.push(`name_like=${name}`)
        }
        queryStr = queryStr + str.join('&')
        console.log(queryStr, 'ssss')
        return queryStr
      },
    }),
  }),
})

export const { useGetUserQuery, useGetUsersQuery } = usersApi
