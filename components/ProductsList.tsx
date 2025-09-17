import _ from "lodash";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Price, PricesContainer } from "@commercelayer/react-components";
import { Product } from "@typings/models";

type Props = {
  products: Product[];
};

const ProductsList = ({ products }: Props) => {
  const {
    query: { countryCode, lang }
  } = useRouter();
  return (
    <div className="mt-12 sm:ml-10 lg:col-span-2">
      <ul className="space-y-12 md:pt-7 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:gap-x-8">
        {products.map(({ images, name, variants, slug }, key: number) => {
          const img = _.first(images)?.url;
          const code = _.first(variants)?.code;
          return (
            <li key={key}>
              <Link
                href={"/[countryCode]/[lang]/[productName]"}
                as={`/${countryCode}/${lang}/${slug}`}
                passHref
              >
                <div className="flex flex-col h-full rounded-lg md:p-3">
                    {img &&
                    <Image
                      className="object-contain"
                      src={`${img}`}
                      alt={name}
                      width={200}
                      height={50}
                    />
                    }
                  <h3 className="h-full space-y-1 text-base font-medium leading-6">{name}</h3>
                  <div className="mt-5 justify-self-end">
                    <ul className="flex items-center justify-between space-x-1">
                      <li>
                        <PricesContainer skuCode={code}>
                          <Price
                            className="mr-1 text-base font-bold text-indigo-600 md:text-sm"
                            compareClassName="text-gray-500 line-through text-sm md:text-xs"
                          />
                        </PricesContainer>
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductsList;
