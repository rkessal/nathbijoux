import React, { useState } from "react";
import Link from "next/link";
import { LineItemsContainer, LineItemsCount } from "@commercelayer/react-components";
import locale from "@locale/index";
import SEOHead from "@components/SEO";

type Props = {
  lang: string;
  countryCode: string;
  pageTitle?: string;
};

const Header: React.FC<Props> = ({ lang, countryCode, pageTitle }) => {
  const [menu, setMenu] = useState(false);
  const onClick = () => {
    setMenu(!menu);
  };
  return (
    <>
      <SEOHead productName={pageTitle} />
      <nav
        className="px-5 bg-fwhite z-20 sticky h-[60px] top-0 w-full mx-auto flex items-center justify-between"
        aria-label="Header navigation"
      >
        <div className="hover:cursor-pointer" onClick={onClick}>
          Menu
        </div>
        {menu && <Menu lang={lang} countryCode={countryCode} onClick={onClick} />}

        <div className="absolute transform -translate-x-1/2 left-1/2">
          <Link href={"/[countryCode]/[lang]/"} as={`/${countryCode}/${lang}/`}>
            NATH-BIJOUX
          </Link>
        </div>

        <Link href={"/[countryCode]/[lang]/cart"} as={`/${countryCode}/${lang}/cart`}>
          <div className="flex flex-row items-center">
            <span className="hidden md:inline-block">{locale[lang].shoppingBag}</span>

            <LineItemsContainer>
              <LineItemsCount className="inline-flex items-center px-2 py-1 -ml-4 text-sm font-medium leading-5 text-white rounded-full bg-blue md:ml-2" />
            </LineItemsContainer>
          </div>
        </Link>
      </nav>
    </>
  );
};

type PropsMenu = {
  lang: string;
  countryCode: string;
  onClick?: () => void;
};
const Menu = ({ lang, countryCode, onClick }: PropsMenu) => (
  <div className="absolute top-0 left-0 z-30 w-screen h-screen text-5xl text-white bg-transparent font-absans">
    <div className="relative w-full h-full py-20 px-36 sm:w-1/2 bg-blue">
      <p className="absolute text-sm cursor-pointer font-stevie top-5 right-5" onClick={onClick}>
        FERMER
      </p>
      <ul className="flex flex-col gap-y-5">
        <Link href={`/${countryCode}/${lang}/`}>
          <li>Accueil</li>
        </Link>
        <Link href={`/${countryCode}/${lang}/shop`}>
          <li>Boutique</li>
        </Link>
      </ul>
    </div>
  </div>
);

export default Header;
