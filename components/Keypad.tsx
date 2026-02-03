
import React from 'react';
import { KEYPAD_LAYOUT } from '../constants';

interface KeypadProps {
  onDigitClick: (digit: string) => void;
  onDeleteClick: () => void;
  onCallClick: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onDigitClick, onDeleteClick, onCallClick }) => {
  return (
    <div className="px-6 flex flex-col items-center">
      <div className="grid grid-cols-3 gap-4 w-full max-w-[260px]">
        {KEYPAD_LAYOUT.map((digit) => (
          <button
            key={digit}
            onPointerDown={(e) => {
              // Using onPointerDown for faster response on mobile
              onDigitClick(digit);
            }}
            className="h-16 w-16 mx-auto rounded-full bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-center active:bg-blue-50 active:scale-95 transition-all select-none"
          >
            <span className="text-3xl font-normal text-gray-700 pointer-events-none">{digit}</span>
            {['2','3','4','5','6','7','8','9'].includes(digit) && (
               <span className="text-[8px] font-bold text-gray-400 -mt-1 uppercase tracking-widest pointer-events-none">
                  {digit === '2' ? 'ABC' : digit === '3' ? 'DEF' : digit === '4' ? 'GHI' : digit === '5' ? 'JKL' : digit === '6' ? 'MNO' : digit === '7' ? 'PQRS' : digit === '8' ? 'TUV' : 'WXYZ'}
               </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4 w-full max-w-[260px] mt-6 items-center">
        <div className="flex justify-center" />
        <button
          onClick={onCallClick}
          className="h-16 w-16 mx-auto rounded-full bg-green-500 shadow-lg flex items-center justify-center text-white active:bg-green-600 active:scale-90 transition-all"
        >
          <i className="fa-solid fa-phone text-2xl"></i>
        </button>
        <button
          onClick={onDeleteClick}
          className="h-16 w-16 mx-auto rounded-full bg-transparent flex items-center justify-center text-gray-300 active:text-gray-600 active:scale-90 transition-all"
        >
          <i className="fa-solid fa-backspace text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Keypad;
