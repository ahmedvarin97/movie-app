import { useEffect, useState } from "react";

const useFetch = <T,>(fetchFunction: (params: any) => Promise<T>, params: any = {}) => {
    const [data, setData] = useState<T | null>(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async() => {
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

    useEffect(() => {
        fetchData();
    }, [fetchFunction, JSON.stringify(params)])

    return {data, loading, error}
}

export default useFetch;