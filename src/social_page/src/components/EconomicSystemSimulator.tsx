import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Home, Sun, Factory, Truck, Coins, Globe, Wheat, Shirt, ShoppingBag, ArrowRight, ArrowLeft, Scale, Heart, Lightbulb, TrendingUp, Users, BookOpen, MapPin, Building, Shield, Target, BarChart3, Zap, Maximize2, Minimize2 } from 'lucide-react';

interface Step {
  id: string;
  color: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const EconomicSystemSimulator: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Color mapping for Tailwind classes
  const getColorClasses = (color: string, type: 'bg' | 'border' | 'text' = 'bg') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-900',
        iconBg: 'bg-blue-500',
        iconText: 'text-blue-600',
        headerBg: 'bg-blue-50',
        headerBorder: 'border-blue-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-100',
        text: 'text-purple-900',
        iconBg: 'bg-purple-500',
        iconText: 'text-purple-600',
        headerBg: 'bg-purple-50',
        headerBorder: 'border-purple-100'
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        text: 'text-emerald-900',
        iconBg: 'bg-emerald-500',
        iconText: 'text-emerald-600',
        headerBg: 'bg-emerald-50',
        headerBorder: 'border-emerald-100'
      },
      amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        text: 'text-amber-900',
        iconBg: 'bg-amber-500',
        iconText: 'text-amber-600',
        headerBg: 'bg-amber-50',
        headerBorder: 'border-amber-100'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        text: 'text-indigo-900',
        iconBg: 'bg-indigo-500',
        iconText: 'text-indigo-600',
        headerBg: 'bg-indigo-50',
        headerBorder: 'border-indigo-100'
      },
      teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-100',
        text: 'text-teal-900',
        iconBg: 'bg-teal-500',
        iconText: 'text-teal-600',
        headerBg: 'bg-teal-50',
        headerBorder: 'border-teal-100'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-100',
        text: 'text-yellow-900',
        iconBg: 'bg-yellow-500',
        iconText: 'text-yellow-600',
        headerBg: 'bg-yellow-50',
        headerBorder: 'border-yellow-100'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-100',
        text: 'text-orange-900',
        iconBg: 'bg-orange-500',
        iconText: 'text-orange-600',
        headerBg: 'bg-orange-50',
        headerBorder: 'border-orange-100'
      },
      rose: {
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        text: 'text-rose-900',
        iconBg: 'bg-rose-500',
        iconText: 'text-rose-600',
        headerBg: 'bg-rose-50',
        headerBorder: 'border-rose-100'
      },
      violet: {
        bg: 'bg-violet-50',
        border: 'border-violet-100',
        text: 'text-violet-900',
        iconBg: 'bg-violet-500',
        iconText: 'text-violet-600',
        headerBg: 'bg-violet-50',
        headerBorder: 'border-violet-100'
      },
      cyan: {
        bg: 'bg-cyan-50',
        border: 'border-cyan-100',
        text: 'text-cyan-900',
        iconBg: 'bg-cyan-500',
        iconText: 'text-cyan-600',
        headerBg: 'bg-cyan-50',
        headerBorder: 'border-cyan-100'
      },
      sky: {
        bg: 'bg-sky-50',
        border: 'border-sky-100',
        text: 'text-sky-900',
        iconBg: 'bg-sky-500',
        iconText: 'text-sky-600',
        headerBg: 'bg-sky-50',
        headerBorder: 'border-sky-100'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-100',
        text: 'text-pink-900',
        iconBg: 'bg-pink-500',
        iconText: 'text-pink-600',
        headerBg: 'bg-pink-50',
        headerBorder: 'border-pink-100'
      },
      slate: {
        bg: 'bg-slate-50',
        border: 'border-slate-100',
        text: 'text-slate-900',
        iconBg: 'bg-slate-500',
        iconText: 'text-slate-600',
        headerBg: 'bg-slate-50',
        headerBorder: 'border-slate-100'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const steps: Step[] = [
    {
      id: "intro",
      color: "blue",
      icon: <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "The Big House",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-blue-50 p-4 md:p-6 rounded-3xl border border-blue-100">
            <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-2">Economics = House Management</h3>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base">
              Imagine India is one giant house. Just like your parents manage money for food, rent, and fun, the country manages its resources for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-2xl border-2 border-slate-100 text-center hover:border-blue-200 transition-colors shadow-sm">
              <span className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Greek: Oikos</span>
              <span className="block font-black text-lg md:text-xl text-slate-800">"House"</span>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-2xl border-2 border-slate-100 text-center hover:border-blue-200 transition-colors shadow-sm">
              <span className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Greek: Nomos</span>
              <span className="block font-black text-lg md:text-xl text-slate-800">"Management"</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "systems",
      color: "purple",
      icon: <Scale className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "Who Runs the Kitchen?",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Every country must decide: <strong>Who owns the resources?</strong> and <strong>Who makes the decisions?</strong> This is the Economic System.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3 p-3 md:p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="bg-red-100 p-2 h-fit rounded-lg shrink-0"><Factory size={20} className="text-red-600"/></div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm md:text-base">1. Capitalist Economy</h4>
                <p className="text-xs md:text-sm text-slate-500 mt-1">Private owners decide. Profit is the main goal. <br/><span className="italic text-slate-400">(e.g., USA)</span></p>
              </div>
            </div>
            <div className="flex gap-3 p-3 md:p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="bg-slate-100 p-2 h-fit rounded-lg shrink-0"><Home size={20} className="text-slate-600"/></div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm md:text-base">2. Socialist Economy</h4>
                <p className="text-xs md:text-sm text-slate-500 mt-1">Government owns everything. Social welfare is the goal. <br/><span className="italic text-slate-400">(e.g., Former USSR)</span></p>
              </div>
            </div>
            <div className="flex gap-3 p-3 md:p-4 bg-purple-50 border-2 border-purple-200 rounded-xl shadow-md transform scale-[1.02]">
              <div className="bg-purple-100 p-2 h-fit rounded-lg shrink-0"><Scale size={20} className="text-purple-600"/></div>
              <div>
                <h4 className="font-bold text-purple-900 text-sm md:text-base">3. Mixed Economy (India)</h4>
                <p className="text-xs md:text-sm text-purple-700 mt-1">Best of both worlds! Public (Govt) and Private sectors work together.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-purple-50 p-3 rounded-xl border border-purple-200">
            <p className="text-xs md:text-sm text-slate-700">
              <strong>In India:</strong> Government runs railways, banks (SBI), defense, while private companies run IT, telecom, retail. This balance helps both growth and social welfare.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "sectors",
      color: "emerald",
      icon: <Sun className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "The Three Brothers",
      content: (
        <div className="space-y-4 animate-in fade-in duration-500">
          <p className="text-slate-600 text-sm md:text-base mb-1">In the family of Economy, three brothers do all the work:</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-green-400 transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
              <div className="bg-green-100 p-2 rounded-xl mt-1 shrink-0">
                <Sun size={18} className="text-green-600" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-slate-800">1. Primary Sector (Nature)</h4>
                <p className="text-slate-600 mt-0.5 text-xs md:text-sm">"I take gifts directly from Mother Earth."</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-lg">Farming</span>
                  <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-lg">Fishing</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-orange-400 transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>
              <div className="bg-orange-100 p-2 rounded-xl mt-1 shrink-0">
                <Factory size={18} className="text-orange-600" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-slate-800">2. Secondary Sector (Maker)</h4>
                <p className="text-slate-600 mt-0.5 text-xs md:text-sm">"I use machines to turn raw things into products."</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-lg">Factories</span>
                  <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-lg">Construction</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
              <div className="bg-blue-100 p-2 rounded-xl mt-1 shrink-0">
                <Truck size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-slate-800">3. Tertiary Sector (Helper)</h4>
                <p className="text-slate-600 mt-0.5 text-xs md:text-sm">"I don't make things. I provide services."</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">Doctors</span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">Transport</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              <strong className="text-emerald-900">In India:</strong> About 45% of people work in Primary sector, but it contributes only 20% to GDP. This shows we need to shift to Secondary and Tertiary sectors for faster growth.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "indian-examples",
      color: "amber",
      icon: <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "Real Indian Examples",
      content: (
        <div className="space-y-4 animate-in fade-in duration-500">
          <p className="text-slate-600 text-sm md:text-base mb-3">Let's see real examples from India:</p>
          
          <div className="space-y-3">
            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
              <div className="flex items-start gap-3">
                <Sun className="text-green-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Primary: Rice in West Bengal</h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">Farmers grow rice → Sold to mill → Becomes food for millions</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-orange-500 shadow-sm">
              <div className="flex items-start gap-3">
                <Factory className="text-orange-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Secondary: Steel in Jamshedpur</h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">Iron ore → Tata Steel factory → Steel bars for construction</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start gap-3">
                <Building className="text-blue-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Tertiary: IT in Bangalore</h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">Software engineers → Code apps → Services for global companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "journey",
      color: "indigo",
      icon: <Shirt className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "The Journey of a Shirt",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <p className="text-slate-600 text-sm md:text-base">How do they work together? Let's follow a shirt.</p>
          
          <div className="relative pl-4 md:pl-6">
            <div className="absolute left-6 md:left-8 top-4 bottom-10 w-0.5 bg-slate-200"></div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4 relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-green-100 rounded-full flex items-center justify-center z-10 shadow-sm shrink-0">
                  <Wheat className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="bg-green-50 px-3 py-2 md:px-4 md:py-3 rounded-xl flex-1 border border-green-100">
                  <div className="text-[9px] md:text-[10px] font-bold text-green-700 uppercase tracking-wider mb-0.5">Step 1: Primary</div>
                  <div className="font-bold text-slate-800 text-sm md:text-base">Farmer grows Cotton</div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-orange-100 rounded-full flex items-center justify-center z-10 shadow-sm shrink-0">
                  <Shirt className="text-orange-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="bg-orange-50 px-3 py-2 md:px-4 md:py-3 rounded-xl flex-1 border border-orange-100">
                  <div className="text-[9px] md:text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-0.5">Step 2: Secondary</div>
                  <div className="font-bold text-slate-800 text-sm md:text-base">Factory weaves Cloth</div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center z-10 shadow-sm shrink-0">
                  <ShoppingBag className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="bg-blue-50 px-3 py-2 md:px-4 md:py-3 rounded-xl flex-1 border border-blue-100">
                  <div className="text-[9px] md:text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-0.5">Step 3: Tertiary</div>
                  <div className="font-bold text-slate-800 text-sm md:text-base">Shop sells Shirt</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
            <p className="text-xs md:text-sm text-slate-700">
              <strong>Note:</strong> Each step adds value! Raw cotton (₹100) → Cloth (₹500) → Shirt in shop (₹1000). This is called "value addition" - each sector makes the product more valuable.
            </p>
          </div>

          <div className="mt-4 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
            <p className="text-xs md:text-sm text-slate-700">
              <strong>Key Point:</strong> All three sectors depend on each other. If Primary fails, Secondary has no raw materials. If Tertiary fails, goods can't reach customers.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "sector-balance",
      color: "teal",
      icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "The Perfect Balance",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              A healthy economy needs all three sectors, but in the right proportion. Too much of one creates problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border-2 border-red-100">
              <div className="text-red-600 font-bold text-xs mb-2">❌ Too Much Primary</div>
              <p className="text-xs text-slate-600">Country stays poor, low income, slow growth</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-yellow-100">
              <div className="text-yellow-600 font-bold text-xs mb-2">⚠️ Too Much Secondary</div>
              <p className="text-xs text-slate-600">Pollution increases, needs raw materials from Primary</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-green-100">
              <div className="text-green-600 font-bold text-xs mb-2">✅ Balanced Mix</div>
              <p className="text-xs text-slate-600">All sectors support each other, steady growth</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">India's Current Status:</h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Primary Sector:</span>
                <span className="font-bold text-green-700">~20% of GDP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Secondary Sector:</span>
                <span className="font-bold text-orange-700">~25% of GDP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tertiary Sector:</span>
                <span className="font-bold text-blue-700">~55% of GDP</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">India is moving towards a service-based economy!</p>
          </div>
        </div>
      )
    },
    {
      id: "gdp",
      color: "yellow",
      icon: <Coins className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "The National Piggy Bank",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-yellow-50 p-4 md:p-6 rounded-full w-32 h-32 md:w-40 md:h-40 mx-auto flex items-center justify-center border-8 border-yellow-100 relative shadow-inner">
             <Coins className="w-12 h-12 md:w-16 md:h-16 text-yellow-600" />
             <div className="absolute top-3 right-6 animate-bounce">
               <span className="text-green-600 font-bold text-xl md:text-2xl">₹</span>
             </div>
          </div>
          
          <div className="text-center space-y-3">
            <h4 className="font-black text-slate-800 text-lg md:text-xl">Gross Domestic Product (GDP)</h4>
            <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              It is the total value of <span className="font-bold text-slate-900 bg-yellow-100 px-1 rounded">ALL</span> final goods and services produced in India in one year.
            </p>
          </div>

          <div className="bg-slate-800 text-white p-4 rounded-xl text-center font-mono shadow-xl mx-auto max-w-sm transform hover:scale-105 transition-transform cursor-default">
            <div className="text-slate-400 mb-1 text-[10px] md:text-xs">FORMULA</div>
            <div className="text-sm md:text-base">
              Total Income / Population <br/>
              = <br/>
              <span className="text-yellow-400 font-bold text-base md:text-lg">Per Capita Income</span>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">India's GDP Growth:</h4>
            <div className="space-y-2 text-xs md:text-sm text-slate-700">
              <p>• <strong>Before 1991:</strong> Slow growth (~3-4% per year)</p>
              <p>• <strong>After 1991 Reforms:</strong> Faster growth (~6-8% per year)</p>
              <p>• <strong>Today:</strong> One of the fastest-growing major economies!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "gdp-limitations",
      color: "orange",
      icon: <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "GDP's Limitations",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              GDP is useful, but it doesn't tell the whole story. Here's what it misses:
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                <Users className="text-orange-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Income Distribution</h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">GDP doesn't show if money is divided equally or if only a few people are rich.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                <Heart className="text-orange-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Quality of Life</h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">A country can have high GDP but poor healthcare, education, or environment.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                <Zap className="text-orange-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Non-Market Activities</h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">Housework, volunteer work, and family care don't count in GDP, but they're valuable!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-100 p-3 rounded-xl text-center">
            <p className="text-xs md:text-sm font-bold text-orange-900">That's why we need HDI and other indicators!</p>
          </div>
        </div>
      )
    },
    {
      id: "hdi",
      color: "rose",
      icon: <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "More Than Just Money",
      content: (
        <div className="space-y-6 animate-in fade-in duration-500">
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">GDP tells us how rich a country is. But does it tell us if people are happy, healthy, or educated? <strong>No.</strong></p>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100 text-center relative overflow-hidden">
             <div className="absolute -right-4 -top-4 bg-rose-50 w-24 h-24 rounded-full"></div>
             <h3 className="text-2xl font-black text-rose-500 mb-1 relative z-10">HDI</h3>
             <p className="font-bold text-slate-800 text-sm uppercase tracking-wide relative z-10">Human Development Index</p>
             <p className="text-[10px] text-slate-400 mt-1 relative z-10">Published by UNDP</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="flex flex-col items-center text-center p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <Heart size={24} className="text-rose-500 mb-2" />
                <span className="text-xs font-bold text-slate-800">Health</span>
                <span className="block text-[10px] text-slate-500 mt-1 leading-tight">Life Expectancy</span>
             </div>
             <div className="flex flex-col items-center text-center p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <Lightbulb size={24} className="text-rose-500 mb-2" />
                <span className="text-xs font-bold text-slate-800">Education</span>
                <span className="block text-[10px] text-slate-500 mt-1 leading-tight">Avg School Years</span>
             </div>
             <div className="flex flex-col items-center text-center p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <Coins size={24} className="text-rose-500 mb-2" />
                <span className="text-xs font-bold text-slate-800">Income</span>
                <span className="block text-[10px] text-slate-500 mt-1 leading-tight">Per Capita</span>
             </div>
          </div>

          <div className="mt-4 bg-rose-50 p-3 rounded-xl border border-rose-200">
            <p className="text-xs md:text-sm text-slate-700">
              <strong>India's HDI Rank:</strong> Around 130-135 out of 190 countries. We're improving but still have work to do in education and healthcare access.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "other-indicators",
      color: "violet",
      icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "Other Development Indicators",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Besides GDP and HDI, economists use other indicators to measure development:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm mb-2">📊 Literacy Rate</h4>
              <p className="text-xs text-slate-600">Percentage of people who can read and write. India: ~77% (improving!)</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm mb-2">🏥 Infant Mortality</h4>
              <p className="text-xs text-slate-600">Deaths of babies per 1000 births. Lower is better. India: ~28 (down from 80 in 1990!)</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm mb-2">💧 Access to Clean Water</h4>
              <p className="text-xs text-slate-600">Percentage with safe drinking water. India: ~94% (huge improvement!)</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm mb-2">⚡ Electricity Access</h4>
              <p className="text-xs text-slate-600">Homes with power connection. India: ~99% (almost universal!)</p>
            </div>
          </div>

          <div className="bg-violet-100 p-3 rounded-xl text-center">
            <p className="text-xs md:text-sm font-bold text-violet-900">All these indicators together give us a complete picture of development!</p>
          </div>
        </div>
      )
    },
    {
      id: "planning",
      color: "cyan",
      icon: <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "Planning the Future",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100">
            <p className="text-slate-700 text-sm md:text-base">To manage a big house like India, we need a plan. For many years, we had the "Planning Commission" (5-Year Plans).</p>
          </div>
          
          <div className="relative">
             <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-slate-200"></div>
             
             <div className="relative z-10 bg-white border border-slate-200 p-4 rounded-xl shadow-sm mb-4 text-center w-3/4 mx-auto opacity-60 grayscale">
                <h4 className="font-bold text-slate-600 text-sm">Planning Commission</h4>
                <p className="text-[10px] text-slate-400">1950 - 2014</p>
             </div>

             <div className="flex justify-center mb-2">
                <div className="bg-slate-200 rounded-full p-1 z-10"><ArrowRight className="transform rotate-90 text-slate-500" size={16} /></div>
             </div>

             <div className="relative z-10 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 p-5 rounded-xl shadow-md text-center">
                <div className="inline-block bg-white p-2 rounded-full shadow-sm mb-2"><TrendingUp className="text-cyan-600" size={24} /></div>
                <h4 className="font-black text-cyan-900 text-lg">NITI Aayog</h4>
                <p className="text-xs font-bold text-cyan-700 uppercase tracking-widest mb-2">Since 2015</p>
                <p className="text-xs text-slate-600">"National Institution for Transforming India"</p>
                <p className="text-[10px] text-slate-400 mt-1">Government's Think Tank</p>
             </div>
          </div>

          <div className="mt-4 bg-cyan-50 p-4 rounded-xl border border-cyan-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Key Differences:</h4>
            <div className="space-y-2 text-xs md:text-sm text-slate-700">
              <div className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span><strong>Planning Commission:</strong> Top-down approach, government decides everything</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span><strong>NITI Aayog:</strong> Cooperative federalism, states and center work together</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span><strong>NITI Aayog:</strong> Focuses on policy research, not rigid 5-year plans</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "five-year-plans",
      color: "sky",
      icon: <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "The 5-Year Plans Era",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              From 1951 to 2014, India followed Five-Year Plans. Each plan had specific goals for 5 years.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">First Plan (1951-56)</h4>
              <p className="text-xs md:text-sm text-slate-600">Focus: Agriculture and irrigation. Built dams and canals.</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">Second Plan (1956-61)</h4>
              <p className="text-xs md:text-sm text-slate-600">Focus: Heavy industries. Built steel plants, power projects.</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-purple-500 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">Later Plans</h4>
              <p className="text-xs md:text-sm text-slate-600">Focus shifted to: Poverty removal, employment, education, health, and technology.</p>
            </div>
          </div>

          <div className="bg-sky-100 p-3 rounded-xl">
            <p className="text-xs md:text-sm text-slate-700">
              <strong>Why changed?</strong> The world economy became faster and more flexible. Rigid 5-year plans couldn't adapt quickly enough. NITI Aayog allows faster decision-making.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "reforms",
      color: "pink",
      icon: <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "1991: Opening the Doors",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="text-center bg-pink-50 p-3 md:p-4 rounded-2xl border border-pink-100">
            <p className="text-slate-700 text-sm md:text-base">Before 1991, India's economy was closed.</p>
            <p className="text-slate-700 text-sm md:text-base">Then came the <span className="font-bold text-pink-600">LPG Reforms</span>.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 transition-colors shadow-sm">
               <div className="bg-indigo-100 text-indigo-700 font-black text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl mb-2">L</div>
               <div>
                 <div className="font-bold text-slate-800 text-sm md:text-base mb-0.5">Liberalization</div>
                 <div className="text-[10px] md:text-xs text-slate-500 leading-tight">Removed strict government rules.</div>
               </div>
             </div>
             <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-colors shadow-sm">
               <div className="bg-purple-100 text-purple-700 font-black text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl mb-2">P</div>
               <div>
                 <div className="font-bold text-slate-800 text-sm md:text-base mb-0.5">Privatization</div>
                 <div className="text-[10px] md:text-xs text-slate-500 leading-tight">Allowed private companies.</div>
               </div>
             </div>
             <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl border-2 border-pink-100 hover:border-pink-300 transition-colors shadow-sm">
               <div className="bg-pink-100 text-pink-700 font-black text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl mb-2">G</div>
               <div>
                 <div className="font-bold text-slate-800 text-sm md:text-base mb-0.5">Globalization</div>
                 <div className="text-[10px] md:text-xs text-slate-500 leading-tight">Connected with the world.</div>
               </div>
             </div>
           </div>
        </div>
      )
    },
    {
      id: "reforms-impact",
      color: "emerald",
      icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "Impact of 1991 Reforms",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              The LPG reforms changed India forever. Here's what happened:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-green-600 font-bold text-sm mb-2">✅ Positive Changes</div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Foreign companies entered India</li>
                <li>• More jobs in IT and services</li>
                <li>• Better technology and products</li>
                <li>• GDP growth increased</li>
                <li>• Middle class grew bigger</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-amber-600 font-bold text-sm mb-2">⚠️ Challenges</div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Some small businesses closed</li>
                <li>• Income gap increased</li>
                <li>• Competition became tougher</li>
                <li>• Some farmers struggled</li>
                <li>• Environmental concerns grew</li>
              </ul>
            </div>
          </div>

          <div className="bg-emerald-100 p-4 rounded-xl border border-emerald-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Overall Result:</h4>
            <p className="text-xs md:text-sm text-slate-700">
              India transformed from a closed, slow-growing economy to one of the world's fastest-growing economies. 
              Today, India is the 5th largest economy globally and continues to grow!
            </p>
          </div>
        </div>
      )
    },
    {
      id: "key-institutions",
      color: "slate",
      icon: <Building className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      title: "Key Economic Institutions",
      content: (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Several important institutions help manage India's economy:
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">🏦 RBI (Reserve Bank of India)</h4>
              <p className="text-xs md:text-sm text-slate-600">Controls money supply, sets interest rates, manages inflation. Like a bank for banks!</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">📊 NITI Aayog</h4>
              <p className="text-xs md:text-sm text-slate-600">Government's think tank. Plans policies, advises on development strategies.</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">💼 Finance Ministry</h4>
              <p className="text-xs md:text-sm text-slate-600">Manages government budget, taxes, and spending. Presents the annual budget.</p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">📈 SEBI (Securities Exchange Board)</h4>
              <p className="text-xs md:text-sm text-slate-600">Regulates stock markets, protects investors, ensures fair trading.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const totalSlides = steps.length;
  const currentStepData = steps[currentSlide];
  const colorClasses = getColorClasses(currentStepData.color);

  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide(curr => {
      if (curr < totalSlides - 1) {
        setTimeout(() => scrollToTop(), 0);
        return curr + 1;
      }
      return curr;
    });
  }, [totalSlides, scrollToTop]);

  const handlePrev = useCallback(() => {
    setCurrentSlide(curr => {
      if (curr > 0) {
        setTimeout(() => scrollToTop(), 0);
        return curr - 1;
      }
      return curr;
    });
  }, [scrollToTop]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Keyboard navigation: ESC to exit fullscreen, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default arrow key behavior (scrolling)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }

      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, handlePrev, handleNext]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return (
    <div 
      className={`h-full w-full flex flex-col items-center pt-4 pb-4 px-4 md:px-6 transition-all duration-300 ${
        isFullscreen 
          ? 'fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] bg-slate-50' 
          : ''
      }`}
      style={isFullscreen ? { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: 99999
      } : {}}
    >
      {/* Main Slide Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden relative transition-all duration-300">
        
        {/* Card Header (Fixed) */}
        <div className={`${colorClasses.headerBg} px-5 py-3 md:px-6 md:py-4 border-b ${colorClasses.headerBorder} flex items-center justify-between gap-3 md:gap-4 shrink-0`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2 md:p-3 rounded-xl ${colorClasses.iconBg} text-white shadow-md transform -rotate-3 transition-transform hover:rotate-0`}>
              {currentStepData.icon}
            </div>
            <div>
                <h2 className="text-lg md:text-2xl font-black text-slate-900">{currentStepData.title}</h2>
            </div>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} className="text-slate-700" /> : <Maximize2 size={20} className="text-slate-700" />}
          </button>
        </div>

        {/* Card Body - Scrollable Area */}
        <div ref={scrollContainerRef} className="p-4 md:p-6 flex-1 overflow-y-auto scroll-smooth">
            <div className="max-w-3xl mx-auto">
                {currentStepData.content}
            </div>
        </div>

        {/* Card Footer controls - Fixed at bottom */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center shrink-0 z-10">
          {currentSlide > 0 ? (
            <button 
              onClick={handlePrev}
              className="flex items-center gap-2 font-bold px-3 md:px-5 py-2 rounded-xl transition-all text-xs md:text-sm text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            >
              <ArrowLeft size={16} /> <span className="hidden md:inline">Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentSlide < totalSlides - 1 ? (
             <button 
               onClick={handleNext}
               className="bg-slate-900 text-white px-5 md:px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-xs md:text-sm"
             >
               Next <span className="hidden md:inline">Concept</span> <ArrowRight size={16} />
             </button>
          ) : (
             <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
               Chapter Completed
             </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomicSystemSimulator;

