import React, { useState } from 'react';
import { TupperwareItem } from '../types';
import { sounds } from '../utils/sound';
import { Package, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TupperwareRegistryProps {
  onClose: () => void;
  onAuditMissing: (itemName: string) => void;
}

export const TupperwareRegistry: React.FC<TupperwareRegistryProps> = ({ onClose, onAuditMissing }) => {
  const [items, setItems] = useState<TupperwareItem[]>([
    {
      id: 'tup_1',
      name: 'Yellow Milton Thermosteel Flask (500ml)',
      origin: 'Bought for school picnic in 2008',
      status: 'SUSPECT_WITH_SHAJI',
      location: "Shaji's bedroom or football ground",
      sentimentalValue: 'Severe (Adappu missing, will scold for 3 weeks)'
    },
    {
      id: 'tup_2',
      name: 'Dubai-Imported Airtight Tupperware Box (Small)',
      origin: 'Brought by Kochunni Ammavan from Deira, UAE (2004)',
      status: 'MISSING',
      location: 'Last seen filled with Thoran at tuition class',
      sentimentalValue: 'Priceless Family Relic'
    },
    {
      id: 'tup_3',
      name: 'Horlicks Glass Jar repurposed for Kadugu (Mustard Seeds)',
      origin: 'Recycled 1999',
      status: 'SAFE',
      location: 'Adukkala top shelf next to turmeric powder',
      sentimentalValue: 'Sacred Kitchen Asset'
    },
    {
      id: 'tup_4',
      name: 'Steel 3-Tier Tiffin Carrier with brass buckle',
      origin: 'Wedding gift from Achan side',
      status: 'DEFCON_1_CRACKED',
      location: 'Under sink, grease layer needs Vim liquid scrub',
      sentimentalValue: 'High Moral Weight'
    }
  ]);

  const handleAudit = (item: TupperwareItem) => {
    sounds.playErrorChord();
    onAuditMissing(item.name);
  };

  const handleMarkFound = (id: string) => {
    sounds.playKeyClick();
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'SAFE', location: 'Returned to Adukkala rack' } : item));
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs select-none bg-[#c0c0c0]">
      <div className="p-3 bg-[#c0c0c0] flex-1 flex flex-col gap-2.5 overflow-y-auto">
        <div className="win95-inset bg-amber-50 p-2 border border-amber-300 text-amber-950 text-[11px] leading-snug">
          <span className="font-bold">⚠️ AMMA STATUTE 404:</span> Any missing Tupperware container constitutes grand larceny against Tharavadu integrity. Prime suspect is always your friend Shaji or negligence from staring at your phone.
        </div>

        <div className="space-y-2 flex-1">
          {items.map((item) => (
            <div key={item.id} className="win95-box p-2 bg-white flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  {item.status === 'SAFE' ? (
                    <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={13} className="text-red-600 flex-shrink-0" />
                  )}
                  <span>{item.name}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase flex-shrink-0 ${
                    item.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : item.status === 'MISSING'
                      ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="text-[11px] text-gray-600 space-y-0.5">
                <div><span className="text-gray-400">Provenance:</span> {item.origin}</div>
                <div><span className="text-gray-400">Coordinates:</span> <span className="font-bold text-gray-800">{item.location}</span></div>
                <div><span className="text-gray-400">Amma Value:</span> {item.sentimentalValue}</div>
              </div>

              <div className="flex justify-end gap-1.5 pt-1 border-t border-gray-200">
                {item.status !== 'SAFE' && (
                  <>
                    <button
                      onClick={() => handleAudit(item)}
                      className="win95-btn px-2 py-1 text-[10px] font-bold text-red-900 bg-red-50 hover:bg-red-100 cursor-pointer flex items-center gap-1"
                    >
                      <Search size={10} />
                      <span>Audit with Amma</span>
                    </button>
                    <button
                      onClick={() => handleMarkFound(item.id)}
                      className="win95-btn px-2 py-1 text-[10px] font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                    >
                      Found in Kitchen
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
