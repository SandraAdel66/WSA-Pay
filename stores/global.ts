import { defineStore } from 'pinia'
import { useFetch } from '#app'

export const useApiFetcher = defineStore('apiFetcher', () => {
  const fetchIndex = async ({
    api,
    filters = {},
    sort = 'id',
    order = 'desc',
    limit = 10,
    paginate = false,
    includeDeleted = false
  }: {
    api: string
    filters?: Record<string, any>
    sort?: string
    order?: 'asc' | 'desc'
    limit?: number
    paginate?: boolean
    includeDeleted?: boolean
  }) => {
    const body = {
      filters,
      orderBy: sort,
      orderByDirection: order,
      perPage: limit,
      paginate,
      delete: includeDeleted
    }

    const { data, error } = await useFetch<any>(`/api/${api}/index`, {
      method: 'POST',
      body
    })

    if (error.value) {
      throw new Error(error.value?.message || 'Fetch failed')
    }

    return data.value
  }

  return {
    fetchIndex
  }
})
