import _ from "lodash";
import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useGetToken } from "@hooks/GetToken";
import Page from "@components/Page";
import Hero from "@components/Hero";
import { Country, Taxonomy } from "@typings/models";
import { parseLanguageCode } from "@utils/parser";
import sanityApi from "@utils/sanity/api";
import News from "@components/News";
import Categories from "@components/Collections";
import FullScreenMessage from "@components/FullScreenMessage";
import Techniques from "@components/Techniques";
import FrequentlyAskedQuestions from "@components/frequently-asked-questions";

type Props = {
  lang: string;
  countries: Country[];
  country: Country;
  taxonomies: Taxonomy[];
  buildLanguages: Country[];
};

const HomePage: NextPage<Props> = ({ lang, countries, country, taxonomies, buildLanguages }) => {
  const languageCode = parseLanguageCode(lang, "toLowerCase", true);
  const countryCode = country?.code.toLowerCase() as string;
  const clMarketId = country?.marketId as string;
  const clEndpoint = process.env.NEXT_PUBLIC_CL_ENDPOINT as string;
  const clToken = useGetToken({
    scope: clMarketId,
    countryCode: countryCode
  });

  let news;
  let categories;
  if (taxonomies) {
    news = taxonomies.find((taxonomy) => taxonomy.name === "Nouveautés");
    categories = taxonomies
    .find((taxonomy) => taxonomy.name === "Catégorie EMEA")?.taxons
    .filter((_, index) => index > 0);
  }

    const techniquesList = [
    {
      title: "Purification", list: [
        {
          title: "Le bol tibetin",
          description: "Disposez votre pierre dans le bol et faites le chanter quelques instants."
        },
        {
          title: "La fleur de vie",
          description: "Posez vos minéraux dessus quelques heures."
        },
        {
          title: "L’eau",
          description: "Disposez vos minéraux dans un bol d’eau pendants plusieurs heures ou laissez couler l’eau pendant quelques minutes."
        }
      ]
    },
    {
      title: "Rechargement", list: [
        {
          title: "Le soleil et la lune",
          description: "Disposez vos pierres en plein soleil ou sous une lune éclatante quelques heures pour les recharger en énergie."
        },
        {
          title: "La fleur de vie",
          description: "Posez vos minéraux dessus quelques heures."
        }
      ]
    }
  ];

  return !lang ? null : (
    <Page
      buildLanguages={buildLanguages}
      lang={lang}
      clToken={clToken}
      clEndpoint={clEndpoint}
      languageCode={languageCode}
      countryCode={countryCode}
      countries={countries}
    >
      <Hero />
      {
        news && <News marketId={clMarketId} countryCode={countryCode} collection={news} />
      }
      {categories && <Categories categories={categories} countryCode={countryCode} />}
       <FullScreenMessage text="Découvrez les techniques essentielles de rechargement et de purification, des rituels indispensables pour préserver l'énergie et la vitalité de vos bijoux et pierres précieuses" />
      <div className="flex flex-col gap-y-20">
        {techniquesList.map((technique) => (
          <Techniques key={technique.title} title={technique.title} list={technique.list} />
        ))}
      </div>
      <FullScreenMessage text="Nous savons que vous pouvez avoir des interrogations, et nous avons les réponses aux questions les plus courantes pour vous accompagner en toute clarté." />
      <FrequentlyAskedQuestions />
      <FullScreenMessage text="Prêt à accueillir la magie des pierres dans votre vie ? Découvrez nos pièces d’exception dès maintenant." CTA={{ label: "Découvrez nos bijoux", href: "/store", image: "/home/home-cta-image.png" }} />
    </Page>
  );
};

export default HomePage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lang = params?.lang as string;
  const countryCode = params?.countryCode as string;
  const countries = await sanityApi.getAllCountries(lang);
  const country = countries.find((country: Country) => country.code.toLowerCase() === countryCode);
  const taxonomies = await sanityApi.getAllTaxonomies(country.catalog.id, lang);
  const buildLanguages = _.compact(
    process.env.BUILD_LANGUAGES?.split(",").map((l) => {
      const country = countries.find((country: Country) => country.code === parseLanguageCode(l));
      return !_.isEmpty(country) ? country : null;
    })
  );

  return {
    props: {
      lang,
      countries,
      country,
      taxonomies,
      buildLanguages
    },
    revalidate: 60
  };
};
