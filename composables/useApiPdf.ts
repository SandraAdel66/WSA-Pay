export const useApiPdf = ({
    api,
    order_by,
    filters,
    sort,
    key = '',
    params = () => ({}),
}: {
    api: string;
    filters?: Record<string, any>;
    key?: string;
    sort?: string;
    order_by?: string;
    params?: () => Record<string, any>;
}) => {
    return useAsyncData(
        key || `api-index-${api}`,
        () =>
            useApiFetch(`/api/${api}`, {
                method: 'POST',
                body: {
                    filters: filters,
                    orderBy: order_by,
                    orderByDirection: sort,
                    ...params() // 🟢 add any extra data like dates, ranges, etc.
                },
                responseType: 'blob', // 🟠 important for downloading files
            })
       
    );

};
