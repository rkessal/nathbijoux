import React from "react";
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
  return (
    <>
      <SEOHead productName={pageTitle} />
        <nav
          className="px-5 bg-fwhite z-20 sticky h-[60px] top-0 w-full mx-auto flex items-center justify-between"
          aria-label="Header navigation"
        >
          <div className="hover:cursor-pointer">
            Menu
          </div>
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

export default Header;
