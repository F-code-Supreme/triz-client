import React, { useState, useRef, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { principlesData } from '@/pages/main/public/learn-triz/components/principles-data';

import { features } from './triz-data';

// Props nếu bạn muốn truyền data từ ngoài vào
interface TrizMatrixProps {
  data?: Record<number, Record<number, number[]>>;
}

export const TrizMatrix: React.FC<TrizMatrixProps> = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    r: number;
    c: number;
  } | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<number | null>(
    null,
  );
  const [showNoSolutionDialog, setShowNoSolutionDialog] =
    useState<boolean>(false);

  // new state for the two shadcn selects
  const [amelior, setAmelior] = useState<string>('');
  const [preserv, setPreserv] = useState<string>('');

  // State for highlighted cell when Find Principle is clicked
  const [highlightedCell, setHighlightedCell] = useState<{
    r: number;
    c: number;
  } | null>(null);

  // State for scan line animation
  const [scanPhase, setScanPhase] = useState<
    'idle' | 'row' | 'column' | 'complete'
  >('idle');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [targetCell, setTargetCell] = useState<{ r: number; c: number } | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref to the scrollable matrix container
  const containerRef = useRef<HTMLDivElement | null>(null);

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
          <button
            key={p}
            type="button"
            aria-label={`Open principle ${p}`}
            className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-blue-600 bg-blue-50 rounded hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
            title={`Principle #${p}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPrinciple(p);
            }}
          >
            {p}
          </button>
        ))}
      </div>
    );
  };

  const selectedPrincipleData = selectedPrinciple
    ? principlesData.find((p) => p.number === selectedPrinciple)
    : null;

  // Check if both parameters are selected (not empty)
  const canFindPrinciple = amelior !== '' && preserv !== '';

  // Helper function to calculate row scan effect
  const getRowScanStyle = (
    cIndex: number,
    scanProgress: number,
  ): { style: React.CSSProperties; show: boolean } => {
    const currentCol = Math.floor(scanProgress * features.length);

    if (cIndex > currentCol) {
      return { style: {}, show: false };
    }

    const distanceFromHead = currentCol - cIndex;
    const fadeLength = 5;
    const opacity = Math.max(0.1, 1 - distanceFromHead / fadeLength);

    return {
      style: {
        backgroundColor: `rgba(34, 197, 94, ${opacity * 0.5})`,
        boxShadow:
          cIndex === currentCol ? '0 0 15px rgba(34, 197, 94, 0.8)' : 'none',
        transition: 'background-color 0.1s ease-out',
      },
      show: true,
    };
  };

  // Helper function to calculate column scan effect
  const getColumnScanStyle = (
    rIndex: number,
    scanProgress: number,
  ): { style: React.CSSProperties; show: boolean } => {
    const currentRow = Math.floor(scanProgress * features.length);

    if (rIndex > currentRow) {
      return { style: {}, show: false };
    }

    const distanceFromHead = currentRow - rIndex;
    const fadeLength = 5;
    const opacity = Math.max(0.1, 1 - distanceFromHead / fadeLength);

    return {
      style: {
        backgroundColor: `rgba(59, 130, 246, ${opacity * 0.5})`,
        boxShadow:
          rIndex === currentRow ? '0 0 15px rgba(59, 130, 246, 0.8)' : 'none',
        transition: 'background-color 0.1s ease-out',
      },
      show: true,
    };
  };

  // Helper function to calculate scan effect for a cell
  const getCellScanEffect = (
    rIndex: number,
    cIndex: number,
  ): { style: React.CSSProperties; show: boolean } => {
    if (!targetCell || scanPhase === 'idle') {
      return { style: {}, show: false };
    }

    if (scanPhase === 'row' && rIndex === targetCell.r) {
      return getRowScanStyle(cIndex, scanProgress);
    }

    if (scanPhase === 'column' && cIndex === targetCell.c) {
      return getColumnScanStyle(rIndex, scanProgress);
    }

    return { style: {}, show: false };
  };

  // Handler for Find Principle button
  const handleFindPrinciple = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!canFindPrinciple || !data || isAnimating) return;

    // Convert string values to numbers (1-based index from features array)
    const ameliorIndex = features.indexOf(amelior) + 1;
    const preservIndex = features.indexOf(preserv) + 1;

    // Check if the cell exists in the matrix data
    // ameliorIndex = row (improving parameter)
    // preservIndex = column (preserving parameter)
    if (data[ameliorIndex]?.[preservIndex]) {
      const targetRow = ameliorIndex - 1;
      const targetCol = preservIndex - 1;

      // Start scan animation
      setIsAnimating(true);
      setHighlightedCell(null);
      setTargetCell({ r: targetRow, c: targetCol });
      setScanPhase('row');
      setScanProgress(0);

      // Phase 1: Scan across the row
      const rowDuration = 800;
      const rowStartTime = Date.now();

      const animateRow = () => {
        const elapsed = Date.now() - rowStartTime;
        const progress = Math.min(elapsed / rowDuration, 1);

        setScanProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animateRow);
        } else {
          // Phase 2: Scan down the column
          setScanPhase('column');
          setScanProgress(0);

          const colStartTime = Date.now();
          const colDuration = 800;

          const animateCol = () => {
            const elapsed = Date.now() - colStartTime;
            const progress = Math.min(elapsed / colDuration, 1);

            setScanProgress(progress);

            if (progress < 1) {
              requestAnimationFrame(animateCol);
            } else {
              // Animation complete, show highlight
              setScanPhase('complete');
              setHighlightedCell({ r: targetRow, c: targetCol });

              setTimeout(() => {
                setTargetCell(null);
                setScanPhase('idle');
                setScanProgress(0);
                setIsAnimating(false);
              }, 100);
            }
          };

          requestAnimationFrame(animateCol);
        }
      };

      requestAnimationFrame(animateRow);

      // Scroll to the cell - will be implemented if needed
      // Scrolling handled after animation when the cell is highlighted
    } else {
      // No principles found for this combination - show dialog
      setShowNoSolutionDialog(true);
      setHighlightedCell(null);
    }
  };

  // When a cell becomes highlighted (after find animation), scroll it into view
  useEffect(() => {
    if (!highlightedCell) return;

    const id = `cell-${highlightedCell.r}-${highlightedCell.c}`;
    const el = document.getElementById(id);

    if (el) {
      // Try to scroll smoothly and center the cell in the viewport of its scroll container
      try {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Fallback for older browsers: compute offsets relative to container
        const container = containerRef.current;
        if (container) {
          const elRect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const offsetTop =
            elRect.top - containerRect.top + container.scrollTop;
          const offsetLeft =
            elRect.left - containerRect.left + container.scrollLeft;

          container.scrollTo({
            top: offsetTop - container.clientHeight / 2,
            left: offsetLeft - container.clientWidth / 2,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [highlightedCell]);

  return (
    <>
      <div>
        <div className="flex flex-col gap-3">
          {/* Form - using shadcn Select and populated from principlesData */}
          <form className="flex items-center gap-4">
            {/* Improve */}
            <div>
              <label htmlFor="amelior" className="font-medium mb-1 flex ">
                <strong>Thông số tăng:</strong>{' '}
                <span className="text-red-500">*</span>
              </label>

              <Select value={amelior} onValueChange={(v) => setAmelior(v)}>
                <SelectTrigger className="w-[320px] p-3 rounded-lg border border-gray-300 text-lg">
                  <SelectValue placeholder="Chọn thông số tăng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {features.map((p, index) => (
                      <SelectItem key={p} value={p}>
                        {index + 1}. {p}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Preserve */}
            <div>
              <label htmlFor="preserv" className="font-medium mb-1 flex">
                <strong>Thông số giảm:</strong>{' '}
                <span className="text-red-500">*</span>
              </label>

              <Select value={preserv} onValueChange={(v) => setPreserv(v)}>
                <SelectTrigger
                  id="preserv"
                  className="w-[320px] p-3 rounded-lg border border-gray-300 text-lg"
                >
                  <SelectValue placeholder="Chọn thông số giảm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {features.map((p, index) => (
                      <SelectItem key={p} value={p}>
                        {index + 1}. {p}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={handleFindPrinciple}
                disabled={!canFindPrinciple}
                className={`p-2 text-base rounded-lg ${
                  canFindPrinciple
                    ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                    : 'bg-blue-500 text-white opacity-70 cursor-not-allowed'
                }`}
              >
                Tìm Nguyên Tắc
              </button>
            </div>
          </form>

          <p className="text-gray-500 mb-3">
            Ví dụ: &ldquo;Tôi muốn cải thiện... mà không làm xấu đi...&ldquo;
          </p>
        </div>
      </div>
      <div className="flex flex-col border border-slate-300 shadow-xl rounded-lg overflow-hidden mx-auto max-w-5xl h-[600px]">
        {/* Grid Container - Xử lý cuộn */}
        <div
          className="flex-1 overflow-auto relative"
          ref={containerRef}
          style={{ scrollbarWidth: 'thin' }}
        >
          <div
            className="grid"
            style={{
              // Cột đầu tiên 200px, 39 cột sau mỗi cột 80px
              gridTemplateColumns: `200px repeat(${features.length}, 85px)`,
            }}
          >
            {/* --- TOP LEFT CORNER (Diagonal Header) --- */}
            <div className="sticky left-0 top-0 z-30 bg-slate-100 border-b border-r border-slate-300 h-32  overflow-hidden shadow-sm">
              <div className="absolute top-2 right-2 text-right font-bold text-xs text-red-600 w-1/2">
                Thông Số
                <br />
                Giảm
              </div>
              <div className="absolute bottom-2 left-2 text-left font-bold text-xs text-green-600 w-1/2">
                Thông Số
                <br />
                Tăng
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
                {features.map((_, cIndex) => {
                  const isHovered =
                    hoveredCell?.r === rIndex || hoveredCell?.c === cIndex;
                  const isExactHover =
                    hoveredCell?.r === rIndex && hoveredCell?.c === cIndex;
                  const isHighlighted =
                    highlightedCell?.r === rIndex &&
                    highlightedCell?.c === cIndex;
                  const isDiagonal = rIndex === cIndex;
                  const canHover = !isAnimating;

                  // Calculate scan line effect
                  const { style: scanStyle, show: showScan } =
                    getCellScanEffect(rIndex, cIndex);

                  return (
                    <button
                      key={`cell-${rIndex}-${cIndex}`}
                      id={`cell-${rIndex}-${cIndex}`}
                      type="button"
                      aria-label={`Cell ${rIndex + 1} → ${cIndex + 1}`}
                      style={showScan ? scanStyle : {}}
                      className={`
                        border-b border-r border-slate-200 p-1 flex items-center justify-center relative
                        ${isDiagonal ? 'bg-slate-100' : 'bg-white'}
                        ${isHovered && !isDiagonal && canHover ? 'bg-blue-50' : ''}
                        ${isExactHover && canHover ? '!bg-blue-100 ring-1 ring-inset ring-blue-300 z-0' : ''}
                        ${isHighlighted ? '!bg-yellow-200 ring-2 ring-inset ring-yellow-500 z-10 animate-[ping_0.8s_ease-in-out_1]' : ''}
                      `}
                      onMouseEnter={() =>
                        canHover && setHoveredCell({ r: rIndex, c: cIndex })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      onFocus={() =>
                        canHover && setHoveredCell({ r: rIndex, c: cIndex })
                      }
                      onBlur={() => setHoveredCell(null)}
                    >
                      {/* Tooltip hiển thị toạ độ khi hover */}
                      {isExactHover && !isDiagonal && (
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

      {/* Principle Dialog */}
      <Dialog
        open={!!selectedPrinciple}
        onOpenChange={(open) => !open && setSelectedPrinciple(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Nguyên tắc {selectedPrincipleData?.number}:{' '}
              {selectedPrincipleData?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {selectedPrincipleData?.image && (
              <img
                src={selectedPrincipleData.image}
                alt={selectedPrincipleData.title}
                className="w-80 object-cover rounded-lg m-auto"
              />
            )}

            <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
              <strong>Mô tả:</strong> {selectedPrincipleData?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* No Solution Dialog */}
      <Dialog
        open={showNoSolutionDialog}
        onOpenChange={(open) => !open && setShowNoSolutionDialog(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chưa có giải pháp</DialogTitle>
          </DialogHeader>
          <div className="flex">
            <div>
              <p className="text-slate-700 leading-relaxed text-base">
                Mâu thuẫn này chưa có giải pháp được đề xuất bởi các Nguyên tắc
                TRIZ.
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Bạn có thể thử điều chỉnh các Thông số.
              </p>
            </div>
            <img
              className="img-fluid rounded-circle"
              src="https://www.triz40.com/Images_Principes_TRIZ/41.jpg"
              alt="TRIZ image"
              width="100"
              height="100"
            ></img>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
