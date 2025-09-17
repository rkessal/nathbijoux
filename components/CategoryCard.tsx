import { Taxon } from "@typings/models";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = { category: Taxon, countryCode: string, imageUrl: string };

const CategoryCard = (props: Props) => {
  const {
    query: { lang }
  } = useRouter();

  if (!props.imageUrl) {
    return null;
  }

  return (
    <li>
      <Link
        href={"/[countryCode]/[lang]/shop?category[productName]"}
        as={`/${props.countryCode}/${lang}/shop?category=${props.category.slug}`}
        passHref
        className="relative grid grid-cols-12 grid-rows-1 gap-5 px-5"
      >
      <Image className="col-span-5 col-start-4" src={props.imageUrl} alt={props.category.name} width={692} height={882} />
      <p className="absolute left-0 col-start-8 text-6xl uppercase bottom-20 font-absans text-blue">{props.category.name}</p>
      </Link>
    </li>
  );
};

export default CategoryCard;