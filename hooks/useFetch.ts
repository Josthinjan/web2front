import { useState, useEffect } from "react";
import { config } from "@/config/config";

// Define interface for fetch configuration
interface FetchConfig extends RequestInit {
  skipToken?: boolean;
}

// Define return type for the hook
interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFetch<T = any>({
  url,
  skipToken = false,
  ...fetchConfig
}: { url: string } & FetchConfig): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token, role, and X-Tenant from sessionStorage or cookies
      const token =
        sessionStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      const role = sessionStorage.getItem("role");
      const tenant = sessionStorage.getItem("X_Tenant");

      // Create headers
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...fetchConfig?.headers,
      };

      // Add Bearer token if exists and not skipped
      if (token && !skipToken) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Add X-Tenant header if tenant exists
      if (tenant) {
        headers["X-Tenant"] = tenant;
      }

      // Determine full URL
      const isAbsoluteUrl = /^(https?:\/\/)/.test(url);
      const apiUrl = isAbsoluteUrl ? url : `${config.API_BASE_URL}${url}`;

      // Perform fetch
      const response = await fetch(apiUrl, {
        ...fetchConfig,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: T = await response.json();
      setData(responseData);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError : new Error(String(fetchError)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
