import React from "react";
import CategoryCard from "./CategoryCard";
import { Taxon } from "@typings/models";

type Props = {
  categories: Taxon[];
  countryCode: string;
};

const imageMap: Record<string, string> = {
  "colliers": "/categories/collier.webp",
  "boucles-d-oreilles": "/categories/boucle-doreille.webp",
  "bracelets": "/categories/bracelet.webp",
  "bagues": "/categories/bague.webp",
  "mineraux": "/categories/mineraux.webp",
  "pierres-roulees": "/categories/pierre-roulee.webp",
  "purification-et-rechargement": "/categories/purification-rechargement.webp",
  "roses": "/categories/roses.webp"
};

const Categories = ({ categories, countryCode }: Props) => {
  return (
    <section className="px-20 py-12 small:py-24">
      <h2 className="mb-10 text-4xl text-center uppercase font-absans">Catégories</h2>

      <ul className="flex flex-col gap-y-60">
        {categories.map((category) => (
          <CategoryCard imageUrl={imageMap[category.slug]} key={category.name} category={category} countryCode={countryCode} />
        ))}
      </ul>
    </section>
  );
};

export default Categories;