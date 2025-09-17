import React from "react";

type Props = { title: string; list: { title: string; description: string }[] };

const Techniques = (props: Props) => {
  return (
    <div className="flex flex-col px-5">
      <h2 className="mb-10 text-4xl text-left uppercase font-absans">{props.title}</h2>
      <ul className="w-full border-t-[1px]">
        {props.list.map((item, index) => (
          <li key={item.title} className="py-5 grid grid-cols-12 border-b-[1px] border-gray-200">
            <p className="col-start-1 text-sm font-absans">
              ({(index + 1).toString().padStart(2, "0")})
            </p>
            <p className="col-start-4 col-end-9 text-2xl font-absans">{item.title}</p>
            <p className="col-span-2 col-start-9 font-sans text-base">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Techniques;
