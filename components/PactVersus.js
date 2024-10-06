import React from 'react';
import BoxReveal from './ui/box-reveal';

export default function PactVersus({ pact1, pact2, Icon }) {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Left Pact */}
            <div className="absolute left-0 text-right text-2xl font-Expose text-black-500 pr-4">
                <BoxReveal boxColor={"#FFB885"} duration={0.5}>
                    {pact1}
                </BoxReveal>
            </div>

      {/* Dynamic Icon at the center of the screen */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {Icon && <Icon className="h-8 w-8 text-gray-500" />}
      </div>

      {/* Right Pact */}
        <div className="absolute right-0 text-left text-2xl font-Expose text-black-500 pl-4">
            <BoxReveal boxColor={"#FFB885"} duration={0.5}>
                {pact2}
            </BoxReveal>
        </div>
    </div>
  );
}
