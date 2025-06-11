'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { CountryToContinent } from './data/countryToContinent';
import { CountryFlags } from './data/countryFlags';

interface PopulationData {
  year: number;
  country: string;
  population: number;
  region: string;
}

const regionsColor: Record<string, string> = {
  Asia: '#6366f1',
  Europe: '#e11d48',
  Africa: '#16a34a',
  Americas: '#f59e0b',
  Oceania: '#0ea5e9',
  Unknown: '#9ca3af', // สีสำหรับประเทศที่ไม่รู้จัก
};

export default function PopulationRacePage() {
  const [dataByYear, setDataByYear] = useState<Record<number, PopulationData[]>>({});
  const [year, setYear] = useState<number>(1950);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(Object.keys(regionsColor));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // เพิ่ม loading state
  const [error, setError] = useState<string | null>(null); // เพิ่ม error state
  const [countryToContinent, setCountryToContinent] = useState<Record<string, string>>(CountryToContinent);
  const [countryFlags, setCountryFlags] = useState<Record<string, string>>(CountryFlags);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/population')
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log('API Data:', response.data);
          
          const raw: PopulationData[] = response.data.map((row: any) => ({
            year: +row.Year,
            country: row['Country name'],
            population: +row.Population,
            region: countryToContinent[row['Country name']] || 'Unknown',
          }));

          const grouped: Record<number, PopulationData[]> = {};
          console.log(raw);
          
          raw.forEach((row) => {
            if (!countryToContinent[row.country]) return;
            if (!grouped[row.year]) grouped[row.year] = [];
            grouped[row.year].push(row);
          });

          for (const y in grouped) {
            grouped[+y] = grouped[+y].sort((a, b) => b.population - a.population);
          }

          setDataByYear(grouped);
          setError(null);
        } else {
          console.error('API Error:', response.error);
          setError('Failed to load data from API');
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError('Failed to fetch data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setYear((prev) => (prev < 2021 ? prev + 1 : 1950));
      }, 1500);
      setIntervalId(interval);
      
      return () => {
        clearInterval(interval);
        setIntervalId(null);
      };
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [isPlaying]);

  // ฟังก์ชันสำหรับ toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const chartData = dataByYear[year] || [];
  // กรองข้อมูลตามทวีปที่เลือก
  const filteredData = chartData.filter(item => selectedRegions.includes(item.region));
  const top12Data = filteredData.slice(0, 12);
  const maxPopulation = Math.max(...top12Data.map((d) => d.population), 1);

  // ฟังก์ชันสำหรับ toggle ทวีป
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        // หากเลือกอยู่แล้ว ให้ยกเลิก
        return prev.filter(r => r !== region);
      } else {
        // หากยังไม่เลือก ให้เพิ่ม
        return [...prev, region];
      }
    });
  };

  useEffect(() => {
    // โหลด flag-icons CSS
    const flagIconsCSS = document.createElement('link');
    flagIconsCSS.rel = 'stylesheet';
    flagIconsCSS.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css';
    document.head.appendChild(flagIconsCSS);

    // เพิ่ม CSS style สำหรับ slider
    const style = document.createElement('style');
    style.textContent = `
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        box-shadow: 0 0 2px 0 #555;
      }
      .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: none;
      }
      .fi {
        width: 20px;
        height: 15px;
        border-radius: 2px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(flagIconsCSS);
      document.head.removeChild(style);
    };
  }, []);

  // Loading component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Population Data</h2>
          <p className="text-gray-500">Please wait while we fetch the data...</p>
          <div className="mt-4">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4 text-start">Population growth per country, 1950 to 2021</h1>
      <p className="text-start text-gray-600 mb-6">Click on the legend below to filter by continent 💡</p>
      
      {/* Legend สำหรับแสดงสีของแต่ละทวีป - คลิกได้ */}
      <div className="flex justify-start mb-6 flex-wrap gap-4">
        {Object.entries(regionsColor).map(([region, color]) => (
          <div 
            key={region} 
            className={`flex items-start gap-2 cursor-pointer px-3 py-1 rounded-lg transition-all duration-200 ${
              selectedRegions.includes(region) 
                ? 'bg-gray-100 opacity-100' 
                : 'bg-gray-50 opacity-50 hover:opacity-75'
            }`}
            onClick={() => toggleRegion(region)}
          >
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            />
            <span className={`text-sm font-medium ${
              selectedRegions.includes(region) ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {region}
            </span>
          </div>
        ))}
      </div>

      {/* แสดงจำนวนทวีปที่เลือก */}
      <div className="text-start mb-4 text-sm text-gray-600">
        Showing {selectedRegions.length} of {Object.keys(regionsColor).length} regions
      </div>

      {/* Scale Bar แกน X (ตัวเลขประชากร) */}
      <div className="mb-4 relative">
        <div className="flex items-center w-full">
          {/* เลขอันดับ */}
          <div className="w-8 text-right font-bold text-gray-600 mr-3"></div>
          
          {/* ชื่อประเทศ */}
          <div className="w-32 font-semibold text-sm mr-3 text-left"></div>
          
          <div className="flex-1 mr-3">
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>0</span>
              <span>{(maxPopulation * 0.2).toLocaleString()}</span>
              <span>{(maxPopulation * 0.4).toLocaleString()}</span>
              <span>{(maxPopulation * 0.6).toLocaleString()}</span>
              <span>{(maxPopulation * 0.8).toLocaleString()}</span>
              <span>{maxPopulation.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-gray-200 rounded mb-4"></div>
          </div>
          
          <div className="w-28"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {top12Data.map((item: PopulationData, index: number) => (
            <motion.div
              key={item.country}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center w-full"
            >
              {/* เลขอันดับ */}
              <div className="w-8 text-right font-bold text-gray-600 mr-3">
                {index + 1}
              </div>
              
              {/* ธงชาติ + ชื่อประเทศ */}
              <div className="w-32 font-semibold text-sm mr-3 text-left flex items-center gap-2">
                
                <span className="truncate">
                  {item.country}
                </span>
              </div>
              
              {/* Container สำหรับ bar */}
              <div className="flex-1 relative mr-3 flex items-center">
                <motion.div
                  className="h-8 rounded bg-opacity-90 flex items-center relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.population / maxPopulation) * 100}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  style={{
                    backgroundColor: regionsColor[item.region] || '#6366f1',
                    minWidth: '20px'
                  }}
                />
                <span className={`fi fi-${countryFlags[item.country] || ''} absolute right-[30px]`}></span>
                <div className="w-28 text-start ">
                  <AnimatedNumber value={item.population} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Year และ Total แสดงด้านขวา */}
        <div className='mt-8 absolute right-[28%] p-4 rounded-lg bottom-[15%]'>
          <div className="text-right mb-6">
            <div className="text-4xl font-bold text-gray-600">{year}</div>
              <div className="text-lg text-gray-600">
                Total: {top12Data.reduce((sum, item) => sum + item.population, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

      {/* Timeline Slider */}
      <div className="mt-8">        
        <div className="relative">
          <input
            type="range"
            min="1950"
            max="2021"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((year - 1950) / (2021 - 1950)) * 100}%, #e5e7eb ${((year - 1950) / (2021 - 1950)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1950</span>
            <span>1960</span>
            <span>1970</span>
            <span>1980</span>
            <span>1990</span>
            <span>2000</span>
            <span>2010</span>
            <span>2021</span>
          </div>
        </div>
        
        {/* Play/Pause Button */}
        <div className="flex justify-start mt-4">
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <span className="text-lg">
              {isPlaying ? '⏸️' : '▶️'}
            </span>
            <span className="font-medium">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { damping: 20, stiffness: 100 });
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value]);

  return (
    <motion.span className="ml-2 tabular-nums text-sm w-24 text-right inline-block">
      {rounded}
    </motion.span>
  );
}
