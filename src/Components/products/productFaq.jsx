
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductFAQs({faqs}) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  return (
    <div className="w-full bg-white font-sans py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index} 
                className="bg-[#F9F9F9] rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-semibold text-black">
                    {faq.question}
                  </span>
                  
                  {/* Icon */}
                  <span className="text-gray-500 ml-4">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>

                {/* Answer Content  */}
                <div 
                  className={`px-6 text-gray-600 text-sm md:text-base leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}