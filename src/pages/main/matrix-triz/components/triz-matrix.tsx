import React, { useState } from 'react';

import { features } from '@/pages/main/matrix-triz/components/triz-data';

// Props nếu bạn muốn truyền data từ ngoài vào
interface TrizMatrixProps {
  data?: Record<number, Record<number, number[]>>;
}

export const TrizMatrix: React.FC<TrizMatrixProps> = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    r: number;
    c: number;
  } | null>(null);

  // Hàm helper để lấy màu nền cho ô
  const getCellContent = (rIndex: number, cIndex: number) => {
    // Logic: Đường chéo chính (r=c) hoặc dữ liệu rỗng
    if (rIndex === cIndex)
      return <span className="text-slate-300 select-none">+</span>; // Dấu + ở đường chéo

    // Lấy dữ liệu từ props data (nếu có)
    const principles = data?.[rIndex + 1]?.[cIndex + 1];

    if (!principles || principles.length === 0)
      return <span className="text-slate-200">-</span>;

    return (
      <div className="flex flex-wrap gap-1 justify-center content-center h-full">
        {principles.map((p) => (
          <span
            key={p}
            className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-blue-600 bg-blue-50 rounded hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
            title={`Principle #${p}`}
          >
            {p}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col border border-slate-300 shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto h-[600px]">
      {/* Grid Container - Xử lý cuộn */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <div
          className="grid"
          style={{
            // Cột đầu tiên 200px, 39 cột sau mỗi cột 80px
            gridTemplateColumns: `200px repeat(${features.length}, 85px)`,
          }}
        >
          {/* --- TOP LEFT CORNER (Diagonal Header) --- */}
          <div className="sticky left-0 top-0 z-30 bg-slate-100 border-b border-r border-slate-300 h-32 relative overflow-hidden shadow-sm">
            {/* Vẽ đường chéo bằng CSS thuần */}
            <div
              className="absolute top-0 left-0 w-full h-full border-b border-slate-300"
              style={{
                transform: 'skewY(22deg)',
                transformOrigin: 'bottom left',
                borderBottomWidth: '1px',
              }}
            ></div>

            <div className="absolute top-2 right-2 text-right font-bold text-xs text-red-600 w-1/2">
              Worsening
              <br />
              Feature
            </div>
            <div className="absolute bottom-2 left-2 text-left font-bold text-xs text-green-600 w-1/2">
              Improving
              <br />
              Feature
            </div>
          </div>

          {/* --- COLUMN HEADERS (1-39) --- */}
          {features.map((feature, index) => (
            <div
              key={`col-head-${index}`}
              className="sticky top-0 z-20 bg-slate-50 border-b border-r border-slate-300 h-32 p-2 flex flex-col justify-end items-center text-center hover:bg-red-50 transition-colors group"
            >
              <span
                className="text-[10px] text-slate-500 font-medium leading-tight mb-2 rotate-180"
                style={{ writingMode: 'vertical-rl' }}
              >
                {feature}
              </span>
              <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-red-500 group-hover:text-white">
                {index + 1}
              </div>
            </div>
          ))}

          {/* --- MATRIX BODY --- */}
          {features.map((rowFeature, rIndex) => (
            <React.Fragment key={`row-${rIndex}`}>
              {/* Row Header (Left Sticky) */}
              <div className="sticky left-0 z-10 bg-slate-50 border-b border-r border-slate-300 p-2 flex flex-row items-center justify-between hover:bg-green-50 transition-colors group">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm group-hover:bg-green-500 group-hover:text-white">
                  {rIndex + 1}
                </div>
                <span className="text-[11px] text-slate-700 font-medium text-right ml-2 leading-tight">
                  {rowFeature}
                </span>
              </div>

              {/* Cells */}
              {features.map((_, cIndex) => {
                const isHovered =
                  hoveredCell?.r === rIndex || hoveredCell?.c === cIndex;
                const isExactHover =
                  hoveredCell?.r === rIndex && hoveredCell?.c === cIndex;

                return (
                  <button
                    key={`cell-${rIndex}-${cIndex}`}
                    type="button"
                    aria-label={`Cell ${rIndex + 1} → ${cIndex + 1}`}
                    className={`
                      border-b border-r border-slate-200 p-1 flex items-center justify-center relative
                      ${rIndex === cIndex ? 'bg-slate-100' : 'bg-white'}
                      ${isHovered && rIndex !== cIndex ? 'bg-blue-50' : ''}
                      ${isExactHover ? '!bg-blue-100 ring-1 ring-inset ring-blue-300 z-0' : ''}
                    `}
                    onMouseEnter={() =>
                      setHoveredCell({ r: rIndex, c: cIndex })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    onFocus={() => setHoveredCell({ r: rIndex, c: cIndex })}
                    onBlur={() => setHoveredCell(null)}
                  >
                    {/* Tooltip hiển thị toạ độ khi hover */}
                    {isExactHover && rIndex !== cIndex && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                        {rIndex + 1} &rarr; {cIndex + 1}
                      </div>
                    )}

                    {getCellContent(rIndex, cIndex)}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
