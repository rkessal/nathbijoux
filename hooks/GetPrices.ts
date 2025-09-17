import { useState, useEffect } from "react";
import { CommerceLayer } from "@commercelayer/sdk";
import { parseEndpoint } from "@utils/parser";

const clEndpoint = process.env.NEXT_PUBLIC_CL_ENDPOINT as string;
const slug = parseEndpoint(clEndpoint);

type PriceData = {
  [sku: string]: CommerceLayer.Price[];
};

type UseGetPrices = {
  (args: { skus: string[]; token: string; enabled?: boolean }): {
    prices: PriceData;
    loading: boolean;
    error: string | null;
  };
};

export const useGetPrices: UseGetPrices = ({ skus, token, enabled = true }) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(skus);

  useEffect(() => {
    if (!enabled || !token || !skus.length || !slug) return;

    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const cl = CommerceLayer({
          organization: slug,
          accessToken: token
        });

        const pricesList = await cl.prices.list({
          filters: {
            sku_code_in: skus.join(",")
          }
        });

        const pricesData: PriceData = {};
        skus.forEach((sku) => {
          const skuPrices = pricesList.filter((price) => price.sku_code === sku);
          pricesData[sku] = skuPrices;

          if (skuPrices.length === 0) {
            console.warn(`No prices found for SKU: ${sku}`);
          }
        });

        setPrices(pricesData);
      } catch (err) {
        console.error("❌ Error fetching prices:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [skus, token, enabled]);

  return { prices, loading, error };
};
