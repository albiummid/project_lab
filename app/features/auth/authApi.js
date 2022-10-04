import { apiSlice } from '../api/apiSlice'
import { setUser } from '../users/userSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => {
        return {
          url: '/auth/register',
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled

          localStorage.setItem(
            'auth',
            JSON.stringify({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          )
        } catch (err) {
          console.log(err, 'error')
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled

          localStorage.setItem(
            'auth',
            JSON.stringify({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          )

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          )
        } catch (err) {
          console.log('got an error', err)
          // do nothing
        }
      },
    }),
    loadUserData: builder.query({
      query: () => {
        return {
          url: '/me',
          method: 'GET',
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const res = await queryFulfilled
        dispatch(setUser(res.data.user))
      },
      providesTags: ['user'],
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useLoadUserDataQuery } =
  authApi
