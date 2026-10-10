import React from 'react';
import { VisualData } from '../types';
import { toArabic } from '../utils/arabicNumbers';

interface VisualChartProps {
  data: VisualData;
}

export const VisualChart: React.FC<VisualChartProps> = ({ data }) => {
  if (data.type === 'none') return null;

  // ===== جدول المدخلة / المخرجة =====
  if (data.type === 'table' && data.table) {
    return (
      <div className="w-full max-w-xs mx-auto my-3 bg-white/95 p-4 rounded-2xl border-2 border-purple-200 shadow-md">
        {data.title && (
          <h4 className="text-center font-bold text-purple-700 text-sm mb-3">
            📋 {data.title}
          </h4>
        )}
        <table className="w-full text-center border-collapse overflow-hidden rounded-xl">
          <thead>
            <tr>
              {data.table.headers.map((h, i) => (
                <th
                  key={i}
                  className="bg-gradient-to-b from-purple-200 to-purple-300 text-purple-950 font-black text-xs sm:text-sm p-2.5 border-2 border-purple-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.table.rows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-pink-50/60' : 'bg-white'}>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`p-2.5 border-2 border-purple-200 font-black text-sm sm:text-base ${
                      cell === '؟'
                        ? 'text-rose-600 bg-rose-50 text-lg animate-pulse'
                        : cIdx === 0
                        ? 'text-purple-900'
                        : 'text-pink-800'
                    }`}
                  >
                    {toArabic(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.type === 'bar-chart' && data.labels && data.values) {
    const rawMax = Math.max(...data.values, 10);
    // خطوة مناسبة للمحور حسب حجم القيم
    const step = rawMax <= 10 ? 2 : rawMax <= 25 ? 5 : 10;
    const maxVal = Math.ceil(rawMax / step) * step;
    const gridValues: number[] = [];
    for (let v = 0; v <= maxVal; v += step) gridValues.push(v);

    const height = 190;
    const barWidth = 42;
    const gap = 20;
    const chartWidth = Math.max(340, data.labels.length * (barWidth + gap) + 60);

    return (
      <div className="w-full max-w-md mx-auto my-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-pink-200 shadow-md">
        {data.title && (
          <h4 className="text-center font-bold text-pink-700 text-sm mb-3">
            📊 {data.title}
          </h4>
        )}
        <div className="overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${height}`}
            className="w-full h-auto min-w-[300px] mx-auto select-none font-['Tajawal',sans-serif]"
          >
            {/* Horizontal grid lines */}
            {gridValues.map((val) => {
              const y = height - 35 - (val / maxVal) * (height - 60);
              return (
                <g key={val}>
                  <line
                    x1="45"
                    y1={y}
                    x2={chartWidth - 15}
                    y2={y}
                    stroke="#fbcfe8"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x="35"
                    y={y + 4}
                    fill="#9d174d"
                    fontSize="11"
                    textAnchor="end"
                    fontWeight="bold"
                  >
                    {toArabic(val)}
                  </text>
                </g>
              );
            })}

            {/* Y Axis line */}
            <line
              x1="45"
              y1="15"
              x2="45"
              y2={height - 35}
              stroke="#ec4899"
              strokeWidth="2"
            />
            {/* X Axis line */}
            <line
              x1="45"
              y1={height - 35}
              x2={chartWidth - 15}
              y2={height - 35}
              stroke="#ec4899"
              strokeWidth="2"
            />

            {/* Bars */}
            {data.labels.map((label, idx) => {
              const val = data.values![idx];
              const barH = (val / maxVal) * (height - 60);
              const x = 55 + idx * (barWidth + gap);
              const y = height - 35 - barH;

              const colors = [
                ['#ec4899', '#db2777'],
                ['#a855f7', '#9333ea'],
                ['#f43f5e', '#e11d48'],
                ['#8b5cf6', '#7c3aed'],
                ['#d946ef', '#c026d3'],
              ];
              const [c1, c2] = colors[idx % colors.length];

              return (
                <g key={idx}>
                  <defs>
                    <linearGradient id={`barGrad-${idx}-${data.title?.length || 0}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c1} />
                      <stop offset="100%" stopColor={c2} />
                    </linearGradient>
                  </defs>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx="6"
                    fill={`url(#barGrad-${idx}-${data.title?.length || 0})`}
                    className="transition-all duration-300"
                  />
                  {/* Value above bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    fill="#831843"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {toArabic(val)}
                  </text>
                  {/* Category label below bar */}
                  <text
                    x={x + barWidth / 2}
                    y={height - 15}
                    fill="#4c0519"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {data.xAxisLabel && (
          <p className="text-center text-[11px] font-bold text-pink-500 mt-1">
            {data.xAxisLabel}
          </p>
        )}
      </div>
    );
  }

  if (data.type === 'line-chart' && data.labels && data.values) {
    const maxVal = 30;
    const minVal = 15;
    const height = 180;
    const chartWidth = 340;
    const pointsCount = data.labels.length;
    const stepX = (chartWidth - 80) / (pointsCount - 1);

    const points = data.values.map((val, idx) => {
      const x = 50 + idx * stepX;
      const y = height - 40 - ((val - minVal) / (maxVal - minVal)) * (height - 70);
      return { x, y, val, label: data.labels![idx] };
    });

    const pathD = points.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 40} L ${points[0].x} ${height - 40} Z`;

    return (
      <div className="w-full max-w-md mx-auto my-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-purple-200 shadow-md">
        {data.title && (
          <h4 className="text-center font-bold text-purple-700 text-sm mb-3">
            📈 {data.title}
          </h4>
        )}
        <div className="overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${height}`}
            className="w-full h-auto min-w-[300px] mx-auto select-none font-['Tajawal',sans-serif]"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d946ef" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d946ef" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[20, 25, 30].map((val) => {
              const y = height - 40 - ((val - minVal) / (maxVal - minVal)) * (height - 70);
              return (
                <g key={val}>
                  <line
                    x1="45"
                    y1={y}
                    x2={chartWidth - 15}
                    y2={y}
                    stroke="#f0abfc"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x="35"
                    y={y + 4}
                    fill="#701a75"
                    fontSize="11"
                    textAnchor="end"
                    fontWeight="bold"
                  >
                    {toArabic(val)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1="45" y1="15" x2="45" y2={height - 40} stroke="#a855f7" strokeWidth="2" />
            <line x1="45" y1={height - 40} x2={chartWidth - 15} y2={height - 40} stroke="#a855f7" strokeWidth="2" />

            {/* Area */}
            <path d={areaD} fill="url(#areaGrad)" />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#9333ea" strokeWidth="3" strokeLinecap="round" />

            {/* Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  fill="#701a75"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {toArabic(pt.val)}°
                </text>
                <text
                  x={pt.x}
                  y={height - 18}
                  fill="#4a044e"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  if (data.type === 'dot-plot' && data.dots) {
    return (
      <div className="w-full max-w-md mx-auto my-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-pink-200 shadow-md">
        {data.title && (
          <h4 className="text-center font-bold text-pink-700 text-sm mb-2">
            📍 {data.title}
          </h4>
        )}
        <div className="p-3 bg-pink-50/60 rounded-xl">
          <div className="flex justify-around items-end h-32 px-4 border-b-2 border-pink-400">
            {data.dots.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end gap-1 pb-1">
                {Array.from({ length: item.count }).map((_, dIdx) => (
                  <div
                    key={dIdx}
                    className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-[10px] shadow-sm transform hover:scale-110 transition-transform"
                    title={`نقطة ${toArabic(dIdx + 1)}`}
                  >
                    ★
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Axis Labels */}
          <div className="flex justify-around items-center pt-2">
            {data.dots.map((item, idx) => (
              <span key={idx} className="font-extrabold text-pink-900 text-base">
                {toArabic(item.value)}
              </span>
            ))}
          </div>
          {data.xAxisLabel && (
            <p className="text-center text-xs font-semibold text-pink-600 mt-2">
              {data.xAxisLabel}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (data.type === 'factor-tree') {
    return (
      <div className="w-full max-w-xs mx-auto my-3 bg-gradient-to-b from-rose-50 to-pink-50 p-4 rounded-2xl border-2 border-pink-300 shadow-sm text-center">
        {data.title && (
          <h4 className="font-bold text-pink-700 text-sm mb-3">
            🌳 {data.title}
          </h4>
        )}
        <div className="flex flex-col items-center gap-2">
          {/* Root */}
          <div className="w-12 h-12 rounded-full bg-pink-500 text-white font-black text-lg flex items-center justify-center shadow-md">
            {toArabic(data.tree?.root ?? 24)}
          </div>
          {/* Branch lines */}
          <div className="w-32 flex justify-between text-pink-400 text-xs font-bold">
            <span>╱</span>
            <span>╲</span>
          </div>
          {/* Level 1 */}
          <div className="flex justify-center gap-12">
            <div className="w-10 h-10 rounded-full bg-purple-400 text-white font-bold text-base flex items-center justify-center shadow">
              {toArabic(String(data.tree?.branches.factor1 ?? 4))}
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-400 text-white font-bold text-base flex items-center justify-center shadow">
              {toArabic(String(data.tree?.branches.factor2 ?? 6))}
            </div>
          </div>
          {/* Branch lines */}
          <div className="flex justify-between w-48 text-purple-400 text-xs font-bold px-2">
            <span>╱ ╲</span>
            <span>╱ ╲</span>
          </div>
          {/* Prime Leaves */}
          <div className="flex justify-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow">
              {toArabic(2)}
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow">
              {toArabic(2)}
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow">
              {toArabic(2)}
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow">
              {toArabic(3)}
            </div>
          </div>
          <p className="text-xs text-pink-800 font-semibold mt-1">
            الأعداد الأولية: {toArabic('2 × 2 × 2 × 3')} = {toArabic('2³ × 3')}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
