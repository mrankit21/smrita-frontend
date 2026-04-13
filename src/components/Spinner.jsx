import React from 'react';

const Spinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className={`${sizes[size]} rounded-full border-yellow-900 border-t-yellow-500 animate-spin`} />
      {text && (
        <p className="font-body text-xs tracking-[0.3em] text-yellow-700 uppercase animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Spinner;
