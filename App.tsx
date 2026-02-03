
import React, { useState, useEffect, useRef } from 'react';
import Keypad from './components/Keypad';
import CallerIdBar from './components/CallerIdBar';
import { MOCK_REGISTRY } from './constants';
import { Category, LookupResult, PhoneEntry } from './types';
import { analyzeNumberPattern } from './services/geminiService';

const App: React.FC = () => {
  const [dialedNumber, setDialedNumber] = useState('');
  const [registry, setRegistry] = useState<PhoneEntry[]>(MOCK_REGISTRY);
  const [lookup, setLookup] = useState<LookupResult>({ match: null });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisTimeoutRef = useRef<any>(null);

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleDigit = (digit: string) => {
    setDialedNumber(prev => {
      const next = prev.length >= 15 ? prev : prev + digit;
      return next;
    });
  };

  const handleDelete = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialedNumber) {
      alert(`Simulating call to: ${dialedNumber}`);
      window.location.href = `tel:${dialedNumber}`;
    }
  };

  const handleSaveContact = () => {
    if (!dialedNumber) return;
    
    const name = window.prompt("Enter contact name for this number:");
    if (name && name.trim()) {
      const newEntry: PhoneEntry = {
        phoneNumber: dialedNumber.replace(/\D/g, ''),
        category: Category.SAFE,
        callerName: name.trim()
      };
      setRegistry(prev => [...prev, newEntry]);
      alert("Contact saved successfully!");
    }
  };

  useEffect(() => {
    if (!dialedNumber) {
      setLookup({ match: null });
      setIsAnalyzing(false);
      return;
    }

    const cleanNumber = dialedNumber.replace(/\D/g, '');
    const match = registry.find(entry => entry.phoneNumber === cleanNumber) || null;
    
    if (match) {
      setLookup({ match });
      setIsAnalyzing(false);
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    } else {
      setLookup({ match: null });
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
      
      if (dialedNumber.length >= 5) {
        setIsAnalyzing(true);
        analysisTimeoutRef.current = setTimeout(async () => {
          try {
            const aiResult = await analyzeNumberPattern(dialedNumber);
            if (aiResult) {
              setLookup({ 
                match: null, 
                aiRiskScore: aiResult.riskScore,
                aiRecommendation: aiResult.riskLabel
              });
            } else {
              setLookup({ match: null, aiRiskScore: 0 });
            }
          } catch (err) {
            console.error(err);
            setLookup({ match: null, aiRiskScore: 0 });
          } finally {
            setIsAnalyzing(false);
          }
        }, 1000);
      } else {
        setIsAnalyzing(false);
      }
    }

    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, [dialedNumber, registry]);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
      <header className="pt-10 pb-4 px-6 flex justify-between items-center bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-xl font-bold text-[#007BFF]">Smart Dialer</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">AI Protection</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="py-8 px-6 flex flex-col items-center justify-center">
          <div className="text-4xl font-light text-gray-800 h-12 text-center break-all w-full">
            {formatPhoneNumber(dialedNumber) || <span className="text-gray-200 tracking-widest">000-0000</span>}
          </div>
          <div className="mt-4 w-full max-w-[280px]">
            <CallerIdBar 
              lookup={lookup} 
              isAnalyzing={isAnalyzing} 
              onSaveContact={dialedNumber ? handleSaveContact : undefined}
            />
          </div>
        </div>

        <div className="mt-auto pb-6">
          <Keypad 
            onDigitClick={handleDigit} 
            onDeleteClick={handleDelete}
            onCallClick={handleCall}
          />
        </div>
      </main>

      <footer className="h-16 bg-white flex justify-around items-center border-t border-gray-100 shrink-0">
        <button className="text-gray-300"><i className="fa-solid fa-clock text-xl"></i></button>
        <button className="text-gray-300"><i className="fa-solid fa-user-group text-xl"></i></button>
        <button className="text-[#007BFF]"><i className="fa-solid fa-th text-xl"></i></button>
        <button className="text-gray-300"><i className="fa-solid fa-shield-halved text-xl"></i></button>
      </footer>
    </div>
  );
};

export default App;
