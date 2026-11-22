import React, { useState } from 'react';

// Responsive 2-Series Area Line Chart
interface DoubleAreaChartProps {
  data: { hour: string; solarKw: number; consumptionKw: number }[];
  height?: number;
}

export const DoubleAreaChart: React.FC<DoubleAreaChartProps> = ({ data, height = 240 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxVal = Math.max(
    80,
    ...data.map((d) => Math.max(d.solarKw, d.consumptionKw))
  ) * 1.15;

  const width = 800;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartW;
  const getY = (val: number) => paddingY + chartH - (val / maxVal) * chartH;

  // Build Solar path (Emerald Green)
  const solarPoints = data.map((d, i) => `${getX(i)},${getY(d.solarKw)}`);
  const solarPath = `M ${solarPoints.join(' L ')}`;
  const solarArea = `${solarPath} L ${getX(data.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;

  // Build Consumption path (Cool Indigo / Navy)
  const consPoints = data.map((d, i) => `${getX(i)},${getY(d.consumptionKw)}`);
  const consPath = `M ${consPoints.join(' L ')}`;
  const consArea = `${consPath} L ${getX(data.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;

  const hoveredItem = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C781" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00C781" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = paddingY + chartH * (1 - pct);
          const val = Math.round(maxVal * pct);
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#292929"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-[#AAB8C5] text-[11px] font-mono-num"
              >
                {val}kW
              </text>
            </g>
          );
        })}

        {/* Areas */}
        <path d={solarArea} fill="url(#solarGrad)" />
        <path d={consArea} fill="url(#consGrad)" />

        {/* Lines */}
        <path d={consPath} fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
        <path d={solarPath} fill="none" stroke="#00C781" strokeWidth="2.5" />

        {/* Data points & hover triggers */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cySolar = getY(d.solarKw);
          const cyCons = getY(d.consumptionKw);
          const isHovered = hoverIndex === i;

          return (
            <g key={i} className="cursor-pointer">
              {/* Invisible wide column for hover */}
              <rect
                x={cx - chartW / (data.length * 2)}
                y={paddingY}
                width={chartW / data.length}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />

              {isHovered && (
                <>
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={paddingY + chartH}
                    stroke="#00E5A0"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle cx={cx} cy={cySolar} r="5" fill="#00E5A0" stroke="#000000" strokeWidth="2" />
                  <circle cx={cx} cy={cyCons} r="4" fill="#38BDF8" stroke="#000000" strokeWidth="2" />
                </>
              )}

              {/* X Axis labels */}
              <text
                x={cx}
                y={height - 4}
                textAnchor="middle"
                className={`text-[11px] font-mono-num ${
                  isHovered ? 'fill-[#00E5A0] font-semibold' : 'fill-[#AAB8C5]'
                }`}
              >
                {d.hour}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover popover tooltip */}
      {hoveredItem && (
        <div
          className="absolute top-2 right-4 bg-[#101010] border border-[#292929] rounded-lg p-2.5 text-xs shadow-xl pointer-events-none transition-all"
        >
          <div className="text-[#AAB8C5] font-medium mb-1">Time: {hoveredItem.hour}</div>
          <div className="flex items-center gap-2 text-[#00E5A0] font-mono-num">
            <span className="w-2 h-2 rounded-full bg-[#00C781]"></span>
            <span>Solar: {hoveredItem.solarKw} kW</span>
          </div>
          <div className="flex items-center gap-2 text-sky-400 font-mono-num">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Usage: {hoveredItem.consumptionKw} kW</span>
          </div>
          <div className="text-[10px] text-[#AAB8C5] mt-1 pt-1 border-t border-[#292929]">
            Net:{' '}
            <span
              className={
                hoveredItem.solarKw >= hoveredItem.consumptionKw
                  ? 'text-[#00E5A0]'
                  : 'text-amber-400'
              }
            >
              {(hoveredItem.solarKw - hoveredItem.consumptionKw).toFixed(1)} kW
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Circular Dial Gauge Component
interface CircularGaugeProps {
  value: number;
  max?: number;
  unit?: string;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  unit = '%',
  label,
  sublabel,
  color = '#00C781',
  size = 160,
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#292929"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono-num tracking-tight text-white">
            {value}
            <span className="text-sm font-normal text-[#AAB8C5] ml-0.5">{unit}</span>
          </span>
          <span className="text-[11px] text-[#AAB8C5] uppercase tracking-wider mt-0.5">{label}</span>
        </div>
      </div>
      {sublabel && (
        <span className="text-xs text-[#AAB8C5] mt-2 text-center">{sublabel}</span>
      )}
    </div>
  );
};

// Stacked / Grouped Bar Chart for Monthly Carbon Reductions
interface CarbonBarChartProps {
  data: { month: string; solarOffset: number; evOffset: number; wasteOffset: number }[];
  height?: number;
}

export const CarbonBarChart: React.FC<CarbonBarChartProps> = ({ data, height = 240 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxTotal = Math.max(
    ...data.map((d) => d.solarOffset + d.evOffset + d.wasteOffset)
  ) * 1.15;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-[#AAB8C5] mb-3 px-1">
        <span>CO₂ Reduction Breakdown (kg)</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#00C781]"></span>
            <span>Solar</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#00E5A0]"></span>
            <span>EV Charging</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
            <span>Waste-to-Value</span>
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-[200px] pt-4 pb-6 border-b border-[#292929]">
        {data.map((item, index) => {
          const total = item.solarOffset + item.evOffset + item.wasteOffset;
          const solarHeightPct = (item.solarOffset / maxTotal) * 100;
          const evHeightPct = (item.evOffset / maxTotal) * 100;
          const wasteHeightPct = (item.wasteOffset / maxTotal) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#101010] border border-[#292929] px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap shadow-xl z-20">
                  <div className="font-semibold text-white">{item.month}: {total} kg CO₂</div>
                  <div className="text-[#AAB8C5] text-[10px]">
                    Solar: {item.solarOffset} · EV: {item.evOffset} · Waste: {item.wasteOffset}
                  </div>
                </div>
              )}

              {/* Stacked bar segments */}
              <div
                className={`w-full max-w-[36px] flex flex-col justify-end rounded-t overflow-hidden transition-transform duration-200 ${
                  isHovered ? 'scale-105 brightness-110' : ''
                }`}
                style={{ height: `${solarHeightPct + evHeightPct + wasteHeightPct}%` }}
              >
                <div
                  className="w-full bg-sky-400"
                  style={{ height: `${(item.wasteOffset / total) * 100}%` }}
                />
                <div
                  className="w-full bg-[#00E5A0]"
                  style={{ height: `${(item.evOffset / total) * 100}%` }}
                />
                <div
                  className="w-full bg-[#00C781]"
                  style={{ height: `${(item.solarOffset / total) * 100}%` }}
                />
              </div>

              {/* Month label */}
              <span
                className={`text-[11px] mt-2 font-medium ${
                  isHovered ? 'text-[#00E5A0]' : 'text-[#AAB8C5]'
                }`}
              >
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
