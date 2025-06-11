"use client";
import { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

const continentColors: Record<string, string> = {
  Asia: "#6366f1",
  Europe: "#f43f5e",
  Africa: "#f59e42",
  Oceania: "#facc15",
  Americas: "#38bdf8",
};


export default function BarChart() {


  const [chartData, setChartData] = useState<any>(null);
  const [year, setYear] = useState<number>(1950);
  const [minYear, setMinYear] = useState<number>(1950);
  const [maxYear, setMaxYear] = useState<number>(2021);
  const dataRef = useRef<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedValues, setDisplayedValues] = useState<number[]>([]); // state สำหรับตัวเลขที่ animate
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


  const countryList = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    fetch("/population-and-demography.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true });
        // หาปีที่น้อยสุดและมากสุดในไฟล์
        const years = parsed.data
          .map((row: any) => Number(row.Year))
          .filter((y: number) => !isNaN(y));
        const min = Math.min(...years);
        const max = Math.max(...years);
        setMinYear(min);
        setMaxYear(max);
        setYear(min);
        dataRef.current = parsed.data;

        const filtered = parsed.data.filter(
  (row: any) =>
    row.Year === String(min) &&
    row["Country name"] &&
    countryList.includes(row["Country name"])
);
const sorted = filtered
  .sort((a: any, b: any) => b.Population - a.Population)
  .slice(0, 12);
setDisplayedValues(sorted.map((row: any) => Number(row.Population)));
      });
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 1. ไม่ต้อง setChartData ใน useEffect [year] ทันที ให้ set เฉพาะ labels, backgroundColor, etc.
  useEffect(() => {
    if (!dataRef.current.length) return;

    const filtered = dataRef.current.filter(
      (row: any) =>
        row.Year === String(year) &&
        row["Country name"] &&
        countryList.includes(row["Country name"])
    );
    const sorted = filtered
      .sort((a: any, b: any) => b.Population - a.Population)
      .slice(0, 12);

    const newValues = sorted.map((row: any) => Number(row.Population));
    // Animate ตัวเลขและ bar พร้อมกัน
    animateNumbers(displayedValues, newValues, setDisplayedValues);

    // setChartData เฉพาะ labels, backgroundColor, ไม่ต้อง set data
    setChartData((prev: any) => ({
      ...prev,
      labels: sorted.map((row: any, idx: number) => `${idx + 1}. ${row["Country name"]}`),
      datasets: [
        {
          ...prev?.datasets?.[0],
          label: `Population (${year})`,
          backgroundColor: sorted.map(
            (row: any) => continentColors[countryToContinent[row["Country name"]]] || "#6366f1"
          ),
        },
      ],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  // 2. ทุกครั้งที่ displayedValues เปลี่ยน ให้ setChartData (data)
  useEffect(() => {
    if (!chartData) return;
    setChartData((prev: any) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: displayedValues,
        },
      ],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedValues]);

  // ฟังก์ชัน animate ตัวเลข
  function animateNumbers(from: number[], to: number[], set: (v: number[]) => void) {
    const duration = 900;
    const start = performance.now();
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const current = to.map((t, i) => {
        const f = from[i] ?? t;
        return Math.round(f + (t - f) * progress);
      });
      set(current);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // วนปีอัตโนมัติ
  useEffect(() => {
    if (minYear === maxYear) return;
    timerRef.current = setInterval(() => {
      setYear((prev) => (prev < maxYear ? prev + 1 : minYear));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [minYear, maxYear]);

  if (!chartData) return <div>Loading...</div>;

  const totalPopulation =
  chartData &&
  chartData.datasets &&
  chartData.datasets[0] &&
  Array.isArray(chartData.datasets[0].data)
    ? chartData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)
    : 0;

  return (
    <div style={{ height: 500 }}>
      <Bar
        data={chartData}
        options={{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
          plugins: {
            legend: { display: false },
            title: { display: true, text: `Population growth per country (${year})` },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#222',
              font: { weight: 'bold' },
              // ใช้ displayedValues ในการแสดงผล
              formatter: (value: number, context: any) => {
                const idx = context.dataIndex;
                // ใช้ displayedValues เฉพาะแสดงตัวเลข
                const val =
                  displayedValues.length === chartData.labels.length
                    ? displayedValues[idx]
                    : value;
                return val?.toLocaleString?.() ?? "";
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: Math.max(...(chartData?.datasets[0]?.data ?? [0])) * 1.05,
            },
          },
        }}
        plugins={[ChartDataLabels]}
      />
      <div className="text-center text-2xl mt-4">{year}</div>
      <div className="text-center text-lg mt-2 font-semibold">
        Total: {(displayedValues.length === chartData.labels.length
    ? displayedValues
    : chartData.datasets[0].data
  ).reduce((sum : number, val : number) => sum + val, 0).toLocaleString()}
      </div>
    </div>
  );
}