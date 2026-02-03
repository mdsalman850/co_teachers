import React, { useState } from 'react';
import { Building2, Gavel, Users, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const GovernanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UNION' | 'STATE'>('UNION');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Union & State Government</h2>
        <p className="text-slate-600">
          India has 28 States and 8 Union Territories. The government works at two main levels.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-200 p-1 rounded-full inline-flex">
          <button
            onClick={() => setActiveTab('UNION')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'UNION' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Union (Central) Government
          </button>
          <button
            onClick={() => setActiveTab('STATE')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'STATE' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            State Government
          </button>
        </div>
      </div>

      {activeTab === 'UNION' ? <UnionSection /> : <StateSection />}
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, children, colorClass }: any) => (
  <div className={`bg-white rounded-xl shadow-md border-t-4 ${colorClass} p-6`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg bg-slate-100`}>
        <Icon size={24} className="text-slate-700" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="space-y-3 text-slate-700">
      {children}
    </div>
  </div>
);

const UnionSection = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="grid md:grid-cols-2 gap-6">
      {/* Executive */}
      <InfoCard title="Union Executive" icon={UserCheck} colorClass="border-orange-500">
        <div className="mb-4">
          <h4 className="font-bold text-lg text-orange-700">President (Nominal Head)</h4>
          <p className="text-sm text-slate-500 mb-2">Constitutional Head & First Citizen</p>
          <ul className="list-disc list-inside text-sm space-y-1 bg-orange-50 p-3 rounded-lg">
            <li>Citizen of India</li>
            <li>Min Age: <strong>35 years</strong></li>
            <li>Qualified for Lok Sabha</li>
            <li>Has <strong>General</strong> & <strong>Emergency</strong> Powers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-blue-700">Prime Minister (Real Head)</h4>
          <p className="text-sm">Leader of the majority party. Heads the Union Council of Ministers.</p>
        </div>
      </InfoCard>

      {/* Judiciary */}
      <InfoCard title="Central Judiciary" icon={Gavel} colorClass="border-red-500">
        <h4 className="font-bold text-lg text-red-700 mb-2">Supreme Court</h4>
        <p className="text-sm mb-3">Started: Jan 26, 1950. Located in Delhi.</p>
        <div className="bg-red-50 p-3 rounded-lg mb-3">
          <span className="font-bold">Composition:</span> 1 Chief Justice of India (CJI) + 33 Judges (Maximum 34)
        </div>
        <div>
          <span className="font-bold text-sm block mb-1">Qualification for Justice:</span>
          <ul className="list-disc list-inside text-sm text-slate-600">
            <li>Citizen of India</li>
            <li>Judge of High Court for 5 years OR</li>
            <li>Advocate of High Court for 10 years</li>
          </ul>
        </div>
      </InfoCard>
    </div>

    {/* Legislature */}
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
        <Building2 />
        <h3 className="text-xl font-bold">The Parliament (Legislature)</h3>
      </div>
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-6">
          <h4 className="text-xl font-bold text-green-700 mb-2">Lok Sabha (Lower House)</h4>
          <p className="text-sm text-slate-500 mb-4">Tenure: 5 Years</p>
          <ul className="space-y-2 text-sm">
             <li className="flex justify-between border-b pb-1"><span>Total Strength:</span> <span className="font-bold">543</span></li>
             <li className="flex justify-between border-b pb-1"><span>Elected:</span> <span className="font-bold">543</span></li>
             <li className="flex justify-between border-b pb-1"><span>Nominated:</span> <span className="font-bold">0</span></li>
             <li className="flex justify-between pt-1 text-blue-600 font-bold"><span>Min Age:</span> <span>25 Years</span></li>
          </ul>
        </div>
        <div className="p-6">
          <h4 className="text-xl font-bold text-indigo-700 mb-2">Rajya Sabha (Upper House)</h4>
          <p className="text-sm text-slate-500 mb-4">Presided by: Vice President</p>
          <ul className="space-y-2 text-sm">
             <li className="flex justify-between border-b pb-1"><span>Max Members:</span> <span className="font-bold">250</span></li>
             <li className="flex justify-between border-b pb-1"><span>Elected:</span> <span className="font-bold">238</span></li>
             <li className="flex justify-between border-b pb-1"><span>Nominated:</span> <span className="font-bold">12 (Experts)</span></li>
             <li className="flex justify-between pt-1 text-blue-600 font-bold"><span>Min Age:</span> <span>30 Years</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const StateSection = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="grid md:grid-cols-2 gap-6">
      {/* Executive */}
      <InfoCard title="State Executive" icon={UserCheck} colorClass="border-green-500">
        <div className="mb-4">
          <h4 className="font-bold text-lg text-green-700">Governor (Nominal Head)</h4>
          <p className="text-sm text-slate-500 mb-2">Appointed by President. Term: 5 Years.</p>
          <ul className="list-disc list-inside text-sm space-y-1 bg-green-50 p-3 rounded-lg">
            <li>Citizen of India</li>
            <li>Min Age: <strong>35 years</strong></li>
            <li>Should not be MP or MLA</li>
            <li>No office of profit</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-blue-700">Chief Minister (Real Head)</h4>
          <p className="text-sm">Leader of the majority party in State Assembly.</p>
        </div>
      </InfoCard>

      {/* Legislature */}
      <div className="bg-white rounded-xl shadow-md border-t-4 border-indigo-500 p-6">
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-slate-100`}>
                <Users size={24} className="text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">State Legislature (Telangana)</h3>
        </div>
        
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-bold text-indigo-800 mb-1">Vidhan Sabha (Assembly)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                        <span className="block text-slate-500">Seats (Telangana)</span>
                        <span className="font-bold text-lg">119</span>
                    </div>
                    <div>
                        <span className="block text-slate-500">Min Age</span>
                        <span className="font-bold text-lg">25 Years</span>
                    </div>
                </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-1">Vidhan Parishath (Council)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                        <span className="block text-slate-500">Members (Telangana)</span>
                        <span className="font-bold text-lg">40</span>
                        <span className="text-xs text-slate-400 block">(35 Elected, 5 Nominated)</span>
                    </div>
                    <div>
                        <span className="block text-slate-500">Min Age</span>
                        <span className="font-bold text-lg">30 Years</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
);
