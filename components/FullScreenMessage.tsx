import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = { text: string; CTA?: { label: string; href: string; image: string } };

const FullScreenMessage = (props: Props) => {
  if (props.CTA) {
    return (
      <div className="relative flex flex-col items-center justify-center w-screen h-screen pt-20 gap-y-10">
        <Image
          className="absolute top-0 left-0 object-cover w-full h-full filter brightness-50"
          src={props.CTA.image}
          alt="CTA"
          width={1688}
          height={935}
        />
        <p className="text-2xl max-w-[550px] w-full text-white font-absans text-center z-10">
          {props.text}{" "}
        </p>
        <Link className="z-10" href="/shop">
          <button className="bg-fwhite p-[20px] text-blue">Découvrir</button>
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <p className="text-2xl max-w-[550px] w-full text-blue font-absans text-center">
        {props.text}{" "}
      </p>
    </div>
  );
};

export default FullScreenMessage;
