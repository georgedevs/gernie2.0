import React from 'react';

const BackgroundWatermark = () => {
  const watermarkText = "George loves Teni #Genie";
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
      {/* Horizontal lines */}
      <div className="absolute w-full flex flex-col justify-between h-full py-20">
        {/* Top line */}
        <div className="w-full whitespace-nowrap animate-slide-left overflow-hidden">
          {Array(6).fill(watermarkText).map((text, i) => (
            <span key={`h1-${i}`} className="inline-block text-3xl font-bold mx-8">
              {text}
            </span>
          ))}
        </div>
        
        {/* Middle line */}
        <div className="w-full whitespace-nowrap animate-slide-right overflow-hidden">
          {Array(6).fill(watermarkText).map((text, i) => (
            <span key={`h2-${i}`} className="inline-block text-3xl font-bold mx-8">
              {text}
            </span>
          ))}
        </div>
        
        {/* Bottom line */}
        <div className="w-full whitespace-nowrap animate-slide-left overflow-hidden">
          {Array(6).fill(watermarkText).map((text, i) => (
            <span key={`h3-${i}`} className="inline-block text-3xl font-bold mx-8">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Center vertical line */}
      <div className="absolute left-1/2 top-0 h-screen transform -translate-x-1/2 flex flex-col items-center justify-center">
        <div className="whitespace-nowrap transform -rotate-90 text-3xl font-bold">
          {watermarkText}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes slideRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-slide-left {
          animation: slideLeft 20s linear infinite;
        }
        
        .animate-slide-right {
          animation: slideRight 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BackgroundWatermark;