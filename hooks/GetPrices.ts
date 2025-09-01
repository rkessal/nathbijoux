import { useState, useEffect } from "react";
import { CommerceLayer } from "@commercelayer/sdk";
import { parseEndpoint } from "@utils/parser";

const clEndpoint = process.env.NEXT_PUBLIC_CL_ENDPOINT as string;
const slug = parseEndpoint(clEndpoint);

type PriceData = {
  [sku: string]: CommerceLayer.Price[];
};

type UseGetPrices = {
  (args: {
    skus: string[];
    token: string;
    enabled?: boolean;
  }): {
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

    const skusList = await cl.skus.list({
      filters: {
        code_in: skus.join(",")
      }
    });

    if (!skusList.length) {
      console.warn("No SKUs found matching the provided codes");
      setPrices({});
      return;
    }

    const skuMap = skusList.reduce((acc, sku) => {
      acc[sku.code] = sku.id;
      return acc;
    }, {} as { [code: string]: string });

    const skuIds = Object.values(skuMap);

    const pricesList = await cl.prices.list({
      filters: {
        sku_id_in: skuIds.join(",")
      }
    });

    const pricesData: PriceData = {};
    skusList.forEach(sku => {
      const skuPrices = pricesList.filter(price => price.sku_code === sku.code);
      pricesData[sku.code] = skuPrices;

      if (skuPrices.length === 0) {
        console.warn(`No prices found for SKU: ${sku.code}`);
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
  }, [skus, token, enabled, slug]);

  return { prices, loading, error };
};