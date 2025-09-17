import React from "react";
import { faqData } from "./data";

const FrequentlyAskedQuestions = () => {
  return (
    <div className="py-12 content-container small:py-24">
      <h2 className="mb-10 text-4xl text-center uppercase font-absans">Questions fréquentes</h2>
      <div className="grid grid-cols-12 gap-6">
        {faqData.map((faq, index) => (
          <div key={index} className="col-start-4 col-end-10 pb-6 border-b border-gray-200">
            <h3 className="mb-2 text-xl font-medium">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrequentlyAskedQuestions;
