import { apiSlice } from '../api/apiSlice'

export const teamsAPI = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTeams: build.query({
      query: (id) => {
        console.log(id, 'id..')
        return `/teams?members.user=${id}&_sort=timestamp&_order=desc`
      },
      providesTags: ['teams'],
    }),
    addTeam: build.mutation({
      query: (data) => ({
        url: '/teams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['teams', 'user'],
    }),
    editTeam: build.mutation({
      query: ({ _id, data }) => {
        return {
          url: `/teams/${_id}`,
          method: 'PUT',
          body: data,
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          let res = await queryFulfilled
          console.log(res, 'res...')
        } catch {}
      },
      invalidatesTags: ['teams', 'user'],
    }),
    deleteTeam: build.mutation({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['teams', 'user'],
    }),
    addTeamMember: build.mutation({
      query: ({ teamId, memberId }) => {
        return {
          url: `/teams/${teamId}/member/${memberId}`,
          method: 'POST',
        }
      },
      invalidatesTags: ['teams'],
    }),
    deleteTeamMember: build.mutation({
      query: ({ teamId, memberId }) => ({
        url: `/teams/${teamId}/member/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['teams'],
    }),
  }),
})

export const {
  useAddTeamMutation,
  useGetTeamsQuery,
  useDeleteTeamMutation,
  useEditTeamMutation,
  useAddTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamsAPI
