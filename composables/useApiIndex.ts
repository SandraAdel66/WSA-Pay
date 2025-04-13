export const useApiIndex = ({
  api,
  key,
  order_by,
  lazy = false,
  server = true,
  watch = [],
  params = () => ({}),
  sort
}: {
  api: string;
  key?: string;
  sort?: string;
  order_by?: string;
  lazy?: boolean;
  server?: boolean;
  watch?: any[];
  params?: () => Record<string, any>;
}) => {
  return useAsyncData(
    key || `api-index-${api}`,
    () =>
      useApiFetch(`/api/${api}/index`, {
        method: 'POST',
        body: {
          filters: {},
          orderBy: order_by || 'created_at',
          orderByDirection: sort || 'desc',
          paginate: true,
          delete: false,
          ...params() // 🟢 inject dynamic pagination/search values
        }
      }),
    {
      lazy,
      server,
      watch
    }
  );
};
