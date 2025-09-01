import React from "react";
import CategoryCard from "./CategoryCard";
import { Taxon } from "@typings/models";

type Props = {
  categories: Taxon[];
  countryCode: string;
};

const imageMap: Record<string, string> = {
  "colliers": "/categories/collier.jpg",
  "boucles-d-oreilles": "/categories/boucle-doreille.jpg",
  "bracelets": "/categories/bracelet.jpg",
  "bagues": "/categories/bague.jpg",
  "mineraux": "/categories/mineraux.jpg",
  "pierres-roulees": "/categories/pierre-roulee.jpg",
  "purification-et-rechargement": "/categories/purification-rechargement.jpg",
  "roses": "/categories/roses.jpg"
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