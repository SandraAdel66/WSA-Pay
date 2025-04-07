export const useApiIndex = ({
    api,
    filters = {},
    sort = 'id',
    order = 'desc',
    limit = 10,
    paginate = false,
    includeDeleted = false,
    key = '',
    lazy = false,
    server = true,
    watch = []
  }: {
    api: string
    filters?: Record<string, any>
    sort?: string
    order?: 'asc' | 'desc'
    limit?: number
    paginate?: boolean
    includeDeleted?: boolean
    key?: string
    lazy?: boolean
    server?: boolean
    watch?: any[]
  }) => {
    const config = useRuntimeConfig()
  
    const body = {
      filters,
      orderBy: sort,
      orderByDirection: order,
      perPage: limit,
      paginate,
      delete: includeDeleted
    }
  
    return useAsyncData(
      key || `api-index-${api}`,
      () =>
        $fetch(`${config.public.apiBaseUrl}/api/${api}/index`, {
          method: 'POST',
          body
        }),
      {
        lazy,
        server,
        watch
      }
    )
  }
  