import React from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Country } from "@typings/models";

type Props = {
  children: React.ReactNode;
  lang: string;
  countryCode: string;
  buildLanguages?: Country[];
  countries?: Country[];
  pageTitle?: string;
};

const Layout: React.FC<Props> = ({
  children,
  buildLanguages = [],
  lang,
  countryCode,
  countries = []
}) => {
  return (
    <div className="relative w-full bg-fwhite">
      <Header lang={lang} countryCode={countryCode} />
      <main>{children}</main>
      <Footer lang={lang} countries={countries} buildLanguages={buildLanguages} />
    </div>
  );
};

export default Layout;
