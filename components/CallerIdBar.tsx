
import React from 'react';
import { Category, LookupResult } from '../types';

interface CallerIdBarProps {
  lookup: LookupResult;
  isAnalyzing: boolean;
  onSaveContact?: () => void;
}

const CallerIdBar: React.FC<CallerIdBarProps> = ({ lookup, isAnalyzing, onSaveContact }) => {
  const { match, aiRiskScore, aiRecommendation } = lookup;
  
  let bgColor = 'bg-white';
  let textColor = 'text-gray-500';
  let iconColor = 'bg-gray-100 text-gray-400';
  let label = 'Unknown Number';
  let subLabel = 'Checking registry...';
  let icon = 'fa-question';
  let showSave = !!onSaveContact && (!match || match.category !== Category.SAFE);

  if (match) {
    if (match.category === Category.SAFE) {
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      iconColor = 'bg-white bg-opacity-20 text-white';
      label = 'Friend';
      subLabel = match.callerName;
      icon = 'fa-user-check';
      showSave = false; // Already saved
    } else if (match.category === Category.SPAM) {
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      iconColor = 'bg-white bg-opacity-20 text-white';
      label = 'Spam';
      subLabel = match.callerName;
      icon = 'fa-shield-virus';
    }
  } else if (isAnalyzing) {
    bgColor = 'bg-blue-50';
    textColor = 'text-blue-600';
    iconColor = 'bg-blue-100 text-blue-500';
    label = 'Analyzing...';
    subLabel = 'AI security check in progress';
    icon = 'fa-robot';
  } else if (aiRiskScore !== undefined) {
    if (aiRiskScore > 75) {
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      iconColor = 'bg-white bg-opacity-20 text-white';
      label = 'Spam';
      subLabel = `Risk Level: ${aiRiskScore}% (High)`;
      icon = 'fa-skull-crossbones';
    } else if (aiRiskScore > 35) {
      bgColor = 'bg-orange-400';
      textColor = 'text-white';
      iconColor = 'bg-white bg-opacity-20 text-white';
      label = 'Suspicious';
      subLabel = `Risk Level: ${aiRiskScore}% (Moderate)`;
      icon = 'fa-triangle-exclamation';
    } else {
      bgColor = 'bg-white';
      textColor = 'text-gray-600';
      label = 'Unknown Number';
      subLabel = 'No known issues found';
      icon = 'fa-user-secret';
    }
  }

  return (
    <div className={`mx-auto w-full max-w-[280px] px-4 py-3 rounded-2xl shadow-sm border border-gray-100 transition-all duration-500 ease-out transform ${bgColor} flex items-center gap-3 h-16 ${!match && !isAnalyzing && aiRiskScore === undefined ? 'opacity-30 grayscale' : 'opacity-100'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${iconColor}`}>
        <i className={`fa-solid ${icon} ${isAnalyzing ? 'animate-bounce' : ''}`}></i>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className={`font-bold text-sm truncate leading-tight ${textColor}`}>{label}</span>
        <span className={`text-[10px] font-bold uppercase tracking-tight opacity-75 truncate ${textColor}`}>{subLabel}</span>
      </div>
      {showSave && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSaveContact?.();
          }}
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${match?.category === Category.SPAM || (aiRiskScore !== undefined && aiRiskScore > 35) ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
          title="Save as Friend"
        >
          <i className="fa-solid fa-plus text-sm"></i>
        </button>
      )}
    </div>
  );
};

export default CallerIdBar;
