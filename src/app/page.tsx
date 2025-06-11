'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

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
const countryToContinent: Record<string, string> = {
  "Afghanistan": "Asia",
  "Albania": "Europe",
  "Algeria": "Africa",
  "Andorra": "Europe",
  "Angola": "Africa",
  "Antigua and Barbuda": "Americas",
  "Argentina": "Americas",
  "Armenia": "Asia",
  "Australia": "Oceania",
  "Austria": "Europe",
  "Azerbaijan": "Asia",
  "Bahamas": "Americas",
  "Bahrain": "Asia",
  "Bangladesh": "Asia",
  "Barbados": "Americas",
  "Belarus": "Europe",
  "Belgium": "Europe",
  "Belize": "Americas",
  "Benin": "Africa",
  "Bhutan": "Asia",
  "Bolivia": "Americas",
  "Bosnia and Herzegovina": "Europe",
  "Botswana": "Africa",
  "Brazil": "Americas",
  "Brunei": "Asia",
  "Bulgaria": "Europe",
  "Burkina Faso": "Africa",
  "Burundi": "Africa",
  "Cabo Verde": "Africa",
  "Cambodia": "Asia",
  "Cameroon": "Africa",
  "Canada": "Americas",
  "Central African Republic": "Africa",
  "Chad": "Africa",
  "Chile": "Americas",
  "China": "Asia",
  "Colombia": "Americas",
  "Comoros": "Africa",
  "Congo": "Africa",
  "Costa Rica": "Americas",
  "Croatia": "Europe",
  "Cuba": "Americas",
  "Cyprus": "Asia",
  "Czechia": "Europe",
  "Democratic Republic of the Congo": "Africa",
  "Denmark": "Europe",
  "Djibouti": "Africa",
  "Dominica": "Americas",
  "Dominican Republic": "Americas",
  "Ecuador": "Americas",
  "Egypt": "Africa",
  "El Salvador": "Americas",
  "Equatorial Guinea": "Africa",
  "Eritrea": "Africa",
  "Estonia": "Europe",
  "Eswatini": "Africa",
  "Ethiopia": "Africa",
  "Fiji": "Oceania",
  "Finland": "Europe",
  "France": "Europe",
  "Gabon": "Africa",
  "Gambia": "Africa",
  "Georgia": "Asia",
  "Germany": "Europe",
  "Ghana": "Africa",
  "Greece": "Europe",
  "Grenada": "Americas",
  "Guatemala": "Americas",
  "Guinea": "Africa",
  "Guinea-Bissau": "Africa",
  "Guyana": "Americas",
  "Haiti": "Americas",
  "Honduras": "Americas",
  "Hungary": "Europe",
  "Iceland": "Europe",
  "India": "Asia",
  "Indonesia": "Asia",
  "Iran": "Asia",
  "Iraq": "Asia",
  "Ireland": "Europe",
  "Israel": "Asia",
  "Italy": "Europe",
  "Jamaica": "Americas",
  "Japan": "Asia",
  "Jordan": "Asia",
  "Kazakhstan": "Asia",
  "Kenya": "Africa",
  "Kiribati": "Oceania",
  "Kuwait": "Asia",
  "Kyrgyzstan": "Asia",
  "Laos": "Asia",
  "Latvia": "Europe",
  "Lebanon": "Asia",
  "Lesotho": "Africa",
  "Liberia": "Africa",
  "Libya": "Africa",
  "Liechtenstein": "Europe",
  "Lithuania": "Europe",
  "Luxembourg": "Europe",
  "Madagascar": "Africa",
  "Malawi": "Africa",
  "Malaysia": "Asia",
  "Maldives": "Asia",
  "Mali": "Africa",
  "Malta": "Europe",
  "Marshall Islands": "Oceania",
  "Mauritania": "Africa",
  "Mauritius": "Africa",
  "Mexico": "Americas",
  "Micronesia": "Oceania",
  "Moldova": "Europe",
  "Monaco": "Europe",
  "Mongolia": "Asia",
  "Montenegro": "Europe",
  "Morocco": "Africa",
  "Mozambique": "Africa",
  "Myanmar": "Asia",
  "Namibia": "Africa",
  "Nauru": "Oceania",
  "Nepal": "Asia",
  "Netherlands": "Europe",
  "New Zealand": "Oceania",
  "Nicaragua": "Americas",
  "Niger": "Africa",
  "Nigeria": "Africa",
  "North Korea": "Asia",
  "North Macedonia": "Europe",
  "Norway": "Europe",
  "Oman": "Asia",
  "Pakistan": "Asia",
  "Palau": "Oceania",
  "Palestine": "Asia",
  "Panama": "Americas",
  "Papua New Guinea": "Oceania",
  "Paraguay": "Americas",
  "Peru": "Americas",
  "Philippines": "Asia",
  "Poland": "Europe",
  "Portugal": "Europe",
  "Qatar": "Asia",
  "Romania": "Europe",
  "Russia": "Europe",
  "Rwanda": "Africa",
  "Saint Kitts and Nevis": "Americas",
  "Saint Lucia": "Americas",
  "Saint Vincent and the Grenadines": "Americas",
  "Samoa": "Oceania",
  "San Marino": "Europe",
  "Sao Tome and Principe": "Africa",
  "Saudi Arabia": "Asia",
  "Senegal": "Africa",
  "Serbia": "Europe",
  "Seychelles": "Africa",
  "Sierra Leone": "Africa",
  "Singapore": "Asia",
  "Slovakia": "Europe",
  "Slovenia": "Europe",
  "Solomon Islands": "Oceania",
  "Somalia": "Africa",
  "South Africa": "Africa",
  "South Korea": "Asia",
  "South Sudan": "Africa",
  "Spain": "Europe",
  "Sri Lanka": "Asia",
  "Sudan": "Africa",
  "Suriname": "Americas",
  "Sweden": "Europe",
  "Switzerland": "Europe",
  "Syria": "Asia",
  "Taiwan": "Asia",
  "Tajikistan": "Asia",
  "Tanzania": "Africa",
  "Thailand": "Asia",
  "Timor-Leste": "Asia",
  "Togo": "Africa",
  "Tonga": "Oceania",
  "Trinidad and Tobago": "Americas",
  "Tunisia": "Africa",
  "Turkey": "Asia",
  "Turkmenistan": "Asia",
  "Tuvalu": "Oceania",
  "Uganda": "Africa",
  "Ukraine": "Europe",
  "United Arab Emirates": "Asia",
  "United Kingdom": "Europe",
  "United States": "Americas",
  "Uruguay": "Americas",
  "Uzbekistan": "Asia",
  "Vanuatu": "Oceania",
  "Vatican City": "Europe",
  "Venezuela": "Americas",
  "Vietnam": "Asia",
  "Yemen": "Asia",
  "Zambia": "Africa",
  "Zimbabwe": "Africa"
};   

// เปลี่ยนจาก emoji เป็น ISO country codes สำหรับ flag-icons
const countryFlags: Record<string, string> = {
  "China": "cn",
  "India": "in", 
  "United States": "us",
  "Indonesia": "id",
  "Pakistan": "pk",
  "Bangladesh": "bd",
  "Nigeria": "ng",
  "Brazil": "br",
  "Russia": "ru",
  "Mexico": "mx",
  "Japan": "jp",
  "Philippines": "ph",
  "Vietnam": "vn",
  "Turkey": "tr",
  "Ethiopia": "et",
  "Germany": "de",
  "Egypt": "eg",
  "Iran": "ir",
  "Thailand": "th",
  "United Kingdom": "gb",
  "France": "fr",
  "Italy": "it",
  "South Africa": "za",
  "Tanzania": "tz",
  "Myanmar": "mm",
  "Kenya": "ke",
  "South Korea": "kr",
  "Colombia": "co",
  "Spain": "es",
  "Uganda": "ug",
  "Argentina": "ar",
  "Algeria": "dz",
  "Sudan": "sd",
  "Ukraine": "ua",
  "Iraq": "iq",
  "Afghanistan": "af",
  "Poland": "pl",
  "Canada": "ca",
  "Morocco": "ma",
  "Saudi Arabia": "sa",
  "Uzbekistan": "uz",
  "Peru": "pe",
  "Angola": "ao",
  "Malaysia": "my",
  "Mozambique": "mz",
  "Ghana": "gh",
  "Yemen": "ye",
  "Nepal": "np",
  "Venezuela": "ve",
  "Madagascar": "mg",
  "Cameroon": "cm",
  "North Korea": "kp",
  "Australia": "au",
  "Niger": "ne",
  "Taiwan": "tw",
  "Sri Lanka": "lk",
  "Burkina Faso": "bf",
  "Mali": "ml",
  "Romania": "ro",
  "Malawi": "mw",
  "Chile": "cl",
  "Kazakhstan": "kz",
  "Zambia": "zm",
  "Guatemala": "gt",
  "Ecuador": "ec",
  "Syria": "sy",
  "Netherlands": "nl",
  "Senegal": "sn",
  "Cambodia": "kh",
  "Chad": "td",
  "Somalia": "so",
  "Zimbabwe": "zw",
  "Guinea": "gn",
  "Rwanda": "rw",
  "Benin": "bj",
  "Burundi": "bi",
  "Tunisia": "tn",
  "Bolivia": "bo",
  "Belgium": "be",
  "Haiti": "ht",
  "Cuba": "cu",
  "South Sudan": "ss",
  "Dominican Republic": "do",
  "Czech Republic": "cz",
  "Greece": "gr",
  "Jordan": "jo",
  "Portugal": "pt",
  "Azerbaijan": "az",
  "Sweden": "se",
  "Honduras": "hn",
  "United Arab Emirates": "ae",
  "Hungary": "hu",
  "Tajikistan": "tj",
  "Belarus": "by",
  "Austria": "at",
  "Papua New Guinea": "pg",
  "Serbia": "rs",
  "Israel": "il",
  "Switzerland": "ch",
  "Togo": "tg",
  "Sierra Leone": "sl",
  "Laos": "la",
  "Paraguay": "py",
  "Libya": "ly",
  "Bulgaria": "bg",
  "Lebanon": "lb",
  "Nicaragua": "ni",
  "Kyrgyzstan": "kg",
  "El Salvador": "sv",
  "Turkmenistan": "tm",
  "Singapore": "sg",
  "Denmark": "dk",
  "Finland": "fi",
  "Congo": "cg",
  "Slovakia": "sk",
  "Norway": "no",
  "Oman": "om",
  "Palestine": "ps",
  "Costa Rica": "cr",
  "Liberia": "lr",
  "Ireland": "ie",
  "Central African Republic": "cf",
  "New Zealand": "nz",
  "Mauritania": "mr",
  "Panama": "pa",
  "Kuwait": "kw",
  "Croatia": "hr",
  "Moldova": "md",
  "Georgia": "ge",
  "Eritrea": "er",
  "Uruguay": "uy",
  "Bosnia and Herzegovina": "ba",
  "Mongolia": "mn",
  "Armenia": "am",
  "Jamaica": "jm",
  "Qatar": "qa",
  "Albania": "al",
  "Puerto Rico": "pr",
  "Lithuania": "lt",
  "Namibia": "na",
  "Gambia": "gm",
  "Botswana": "bw",
  "Gabon": "ga",
  "Lesotho": "ls",
  "North Macedonia": "mk",
  "Slovenia": "si",
  "Guinea-Bissau": "gw",
  "Latvia": "lv",
  "Bahrain": "bh",
  "Equatorial Guinea": "gq",
  "Trinidad and Tobago": "tt",
  "Estonia": "ee",
  "Timor-Leste": "tl",
  "Mauritius": "mu",
  "Cyprus": "cy",
  "Eswatini": "sz",
  "Djibouti": "dj",
  "Fiji": "fj",
  "Reunion": "re",
  "Comoros": "km",
  "Guyana": "gy",
  "Bhutan": "bt",
  "Solomon Islands": "sb",
  "Macao": "mo",
  "Montenegro": "me",
  "Luxembourg": "lu",
  "Western Sahara": "eh",
  "Suriname": "sr",
  "Cabo Verde": "cv",
  "Micronesia": "fm",
  "Maldives": "mv",
  "Malta": "mt",
  "Brunei": "bn"
};

export default function PopulationRacePage() {
  const [dataByYear, setDataByYear] = useState<Record<number, PopulationData[]>>({});
  const [year, setYear] = useState<number>(1950);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(Object.keys(regionsColor));
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // เพิ่ม state สำหรับ play/pause
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // เก็บ interval ID

  useEffect(() => {
    fetch('/population-and-demography.csv')
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            console.log('CSV Data:', result.data);
            
            const raw: PopulationData[] = result.data.map((row: any) => ({
              year: +row.Year,
              country: row['Country name'],
              population: +row.Population,
              region: countryToContinent[row['Country name']] || 'Unknown',
            }));

            const grouped: Record<number, PopulationData[]> = {};
            console.log(raw);
            
            raw.forEach((row) => {
                // Filter only countries included in our country-continent mapping
                if (!countryToContinent[row.country]) return; // ✅ กรอง
              if (!grouped[row.year]) grouped[row.year] = [];
              grouped[row.year].push(row);
            });

            for (const y in grouped) {
              grouped[+y] = grouped[+y].sort((a, b) => b.population - a.population);
            }

            setDataByYear(grouped);
          },
        });
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
