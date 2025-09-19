import { useEffect, useState } from "react";

const useFetch = <T,>(fetchFunction: (params: any) => Promise<T>, autoFetch = true, initialParams: any = {}) => {
    const [data, setData] = useState<T | null>(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async(params = initialParams) => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchFunction(params)
            setData(result)

        } catch (err) {
            // @ts-ignore
            setError(err instanceof Error ? err : new Error('An error occured'))
        }finally{
            setLoading(false)
        }
    }

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }
    useEffect(() => {
    if (autoFetch) {
        fetchData();
    }
    }, [fetchFunction, autoFetch])

    return {data, loading, error, refetch: fetchData, reset}
}

export default useFetch;