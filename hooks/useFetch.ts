import { useState, useEffect, FormEvent } from "react";

interface IUseFetch {
  url: string;
  config?: {};
}
export const useFetch = ({ url, config }: IUseFetch) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          ...config,
        });
        const data = await response.json();
        console.log(data);
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url, config]);

  return { data, loading, error };
}