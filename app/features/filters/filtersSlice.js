const { createSlice } = require('@reduxjs/toolkit')

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    keywords: '',
  },
  reducers: {
    setKeywords: (state, { payload }) => {
      state.keywords = payload
    },
    resetSearch: (state, { payload }) => {
      state.keywords = ''
    },
  },
})

export const filtersReducer = filterSlice.reducer

export const { setKeywords, resetSearch } = filterSlice.actions
