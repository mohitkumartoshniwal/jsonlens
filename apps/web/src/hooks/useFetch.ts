import { useCallback, useState } from "react";

export const useFetch = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<unknown>();
  const [error, setError] = useState<unknown>(null);

  const fetchUrl = useCallback((url: string) => {
    setLoading(true);
    setError(null);

    const urlPattern = /^(http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(url)) {
      setError("URL is Invalid");
      setLoading(false);

      return;
    }

    fetch(url)
      .then((response) => response.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { loading, data, error, fetchUrl, reset } as const;
};
