import { api } from './api'

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['Catalog'] })

export const catalogApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getBonds: build.query<unknown, undefined>({
      query: () => ({
        url: 'catalog/bonds',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['Catalog']
    })
  })
})
