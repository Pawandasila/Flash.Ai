"use client";

import config from '@/data/Lookup';
import React, { useState } from 'react';
import { Button } from '../ui/button';

const gradients = {
  basic: {
    from: "from-blue-500",
    to: "to-indigo-500",
    shadow: "shadow-blue-500/20",
    text: "text-blue-500"
  },
  starter: {
    from: "from-indigo-500",
    to: "to-purple-500",
    shadow: "shadow-indigo-500/20",
    text: "text-indigo-500"
  },
  pro: {
    from: "from-purple-500",
    to: "to-pink-500",
    shadow: "shadow-purple-500/20",
    text: "text-purple-500"
  },
  unlimited: {
    from: "from-pink-500",
    to: "to-rose-500",
    shadow: "shadow-pink-500/20",
    text: "text-pink-500"
  }
};

const PricingComponent = () => {
  return (
    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto'>
      {config.PRICING_OPTIONS.map((price, index) => (
        <PricingCard
          key={index}
          price={price}
          gradient={Object.values(gradients)[index]}
        />
      ))}
    </div>
  );
};

const PricingCard = ({ price, gradient }: { price: any; gradient: any }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [buttonRotateX, setButtonRotateX] = useState(0);
  const [buttonRotateY, setButtonRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / 10);
    const rotateY = ((centerX - x) / 10);

    setRotateX(rotateX);
    setRotateY(rotateY);
    
    // Calculate button rotation - slightly more pronounced than card
    setButtonRotateX(rotateX * 1.2);
    setButtonRotateY(rotateY * 1.2);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setButtonRotateX(0);
    setButtonRotateY(0);
  };

  return (
    <div
      className='h-full relative group'
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute -inset-4 bg-gradient-to-r ${gradient.from} ${gradient.to} rounded-3xl opacity-0 group-hover:opacity-30 blur transition duration-300`}
      />
      <div
        className={`relative h-full border border-gray-800/50 p-8 rounded-3xl flex flex-col bg-gray-900/90 backdrop-blur-sm ${gradient.shadow} transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg`}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'all 0.2s ease-out',
        }}
      >
        {price.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className={`bg-gradient-to-r ${gradient.from} ${gradient.to} text-white px-4 py-1 rounded-full text-sm font-medium`}>
              Most Popular
            </span>
          </div>
        )}
        
        <div className="space-y-2">
          <h2 className={`font-bold text-2xl bg-gradient-to-r ${gradient.from} ${gradient.to} bg-clip-text text-transparent`}>
            {price.name}
          </h2>
          <h3 className='font-medium text-lg text-gray-200'>{price.tokens.toLocaleString()} Tokens</h3>
        </div>
        
        <p className='text-gray-400 mt-4 flex-grow min-h-[80px]'>{price.desc}</p>
        
        <div className="mt-6 space-y-4">
          <h2 className='font-bold text-4xl text-center text-white'>
            ${price.price}
          </h2>
          
          <div className="perspective-1000">
            <Button
              className={`w-full bg-gradient-to-r ${gradient.from} ${gradient.to} hover:opacity-90 transition-all duration-200 text-white transform-gpu`}
              style={{
                transform: `perspective(1000px) rotateX(${buttonRotateX}deg) rotateY(${buttonRotateY}deg)`,
                transition: 'all 0.2s ease-out',
              }}
            >
              Upgrade to {price.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;