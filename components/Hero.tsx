import Image from "next/image";
import Link from "next/link";

type Props = {
  countryCode: string;
  lang: string;
};

const Hero = (props: Props) => {
  return (
    <div className="relative grid w-full grid-cols-12 gap-5 px-5">
      <div className="col-span-8">
        <Image src="/home/hero.webp" alt="Hero" width={1120} height={1104} />
      </div>
      <div className="flex flex-col justify-between col-span-4">
        <h1 className="leading-none tracking-tighter uppercase text-blue text-7xl font-absans">
          Une énergie qui vous ressemble
        </h1>
        <div className="flex flex-col gap-5">
          <p className="text-md text-ui-fg-subtle">
            Des colliers spirituels façonnés pour résonner avec votre âme et sublimer votre aura.
          </p>
          <Link href={`/${props.countryCode}/${props.lang}/shop`}>
            <button className="bg-blue p-[20px] text-white w-full">Aller sur la boutique</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
