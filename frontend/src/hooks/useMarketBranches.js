import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useMarketBranches(marketId) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getMarketBranches(marketId);
        setBranches(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [marketId]);

  const center = branches.length
    ? {
        latitude: branches.reduce((s, b) => s + b.latitude, 0) / branches.length,
        longitude: branches.reduce((s, b) => s + b.longitude, 0) / branches.length,
      }
    : { latitude: 43.8563, longitude: 18.4131 };

  return { branches, loading, center };
}
