import { Taxonomy } from "@typings/models";
import React, { useMemo } from "react";
import { useGetToken } from "@hooks/GetToken";
import { useGetPrices } from "@hooks/GetPrices";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  collection: Taxonomy;
  countryCode: string;
  marketId: string;
};

const News = ({ collection, countryCode, marketId }: Props) => {
  const {
    query: { lang }
  } = useRouter();
  const products = collection.taxons[0].products || [];

  // Get authentication token
  const token = useGetToken({
    scope: marketId,
    countryCode
  });

  // Extract SKUs from products
  const skus = useMemo(() =>
    products.map(product => product.variants[0].code).filter(Boolean),
    [products]
  );

  // Get prices for all products
  const { prices, loading: pricesLoading, error: pricesError } = useGetPrices({
    skus,
    token,
    enabled: !!token && skus.length > 0
  });

  return (
    <section className="px-20 py-12 small:py-24">
      <h2 className="mb-10 text-4xl text-center uppercase font-absans">{collection.name}</h2>

      {pricesError && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          Error loading prices: {pricesError}
        </div>
      )}

      <ul className="flex flex-col w-full md:flex-row md:space-x-4">
        {products.map(product => {
          const productSku = product.variants[0].code;
          const productSlug = product.slug;
          const productPrices = prices[productSku] || [];
          const mainPrice = productPrices[0]; // Get first price or customize logic

          return (
            <li key={product.slug} className="space-y-2 ">

              <Link
                href={"/[countryCode]/[lang]/[productName]"}
                as={`/${countryCode}/${lang}/${productSlug}`}
                passHref
              >
                  <Image
                    src={product.images[0].url}
                    height={750}
                    width={550}
                    className="flex-1 flex-shrink"
                    alt="Product Image"
                  />
                  <div className="flex justify-between mt-4 txt-compact-medium">
                    <div className="text-ui-fg-subtle" data-testid="product-title">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-x-2">
                      <PreviewPrice
                        price={mainPrice}
                        loading={pricesLoading && !mainPrice}
                      />
                    </div>
                  </div>
</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const PreviewPrice = ({ price, loading }: { price: any; loading?: boolean }) => {
  if (loading) {
    return <div className="text-ui-fg-muted">Loading...</div>;
  }

  if (!price) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2">
      <span>
        {price.formatted_amount}
      </span>
      {price.compare_at_formatted_amount && (
        <span className="text-sm line-through text-ui-fg-muted">
          {price.compare_at_formatted_amount}
        </span>
      )}
    </div>
  );
};

export default News;