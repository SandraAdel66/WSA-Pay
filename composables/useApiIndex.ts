export const useApiIndex = ({
  api,
  key = '',
  lazy = false,
  server = true,
  watch = [],
  params = () => ({})
}: {
  api: string;
  key?: string;
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
          orderBy: 'id',
          orderByDirection: 'desc',
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
