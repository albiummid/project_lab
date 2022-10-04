import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import { filtersReducer } from './features/filters/filtersSlice'
import { userReducer } from './features/users/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    filters: filtersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
