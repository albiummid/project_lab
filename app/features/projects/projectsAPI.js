import { apiSlice } from '../api/apiSlice'

export const projectsAPI = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query({
      query: ({ stage, email }) =>
        `/projects?stage=${stage}&emails_like=${email}&_sort=timestamp&_order=desc`,
      providesTags: ['projects'],
    }),
    addProject: build.mutation({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['projects'],
    }),
    editProject: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/projects/${id}`,
          method: 'PATCH',
          body: data,
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          let res = await queryFulfilled
          console.log(res, 'res...')
        } catch {}
      },
      invalidatesTags: ['projects'],
    }),
    deleteProject: build.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['projects'],
    }),
  }),
})

export const {
  useAddProjectMutation,
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useEditProjectMutation,
} = projectsAPI
