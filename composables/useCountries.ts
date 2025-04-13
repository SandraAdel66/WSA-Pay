export const useCountries = ({
    key = 'countries',
    lazy = false,
    server = true,
    watch = [],
  }: {
    key?: string;
    lazy?: boolean;
    server?: boolean;
    watch?: any[];
  } = {}) => {
    return useAsyncData(
      key,
      () => useApiFetch('/api/fetch-countries'),
      {
        lazy,
        server,
        watch
      }
    );
  };
  