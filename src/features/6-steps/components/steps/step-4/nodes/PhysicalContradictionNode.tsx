import { Handle, Position, type NodeProps } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';
import { memo } from 'react';

interface PhysicalContradictionNodeData {
  element: string;
  propertyDimension: string;
  stateA: string;
  stateB: string;
  benefitA: string;
  benefitB: string;
  contradictionStatement: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const PhysicalContradictionNode = memo((props: NodeProps) => {
  const data = props.data as unknown as PhysicalContradictionNodeData;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`px-4 py-3 shadow-lg rounded-md border-2 min-w-[300px] max-w-[400px] cursor-pointer transition-all ${
        data.isSelected
          ? 'bg-amber-500 border-amber-600'
          : 'bg-purple-500 border-purple-600 hover:bg-purple-600'
      }`}
      onClick={data.onSelect}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-400"
      />

      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-white font-bold text-sm mb-1">
            Mâu thuẫn Lý học (ML)
          </div>
          <div className="text-white/90 text-xs font-medium mb-1">
            {data.element}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-white/90">
        <div>
          <span className="font-semibold">Thuộc tính: </span>
          {data.propertyDimension}
        </div>
        <div className="bg-white/20 p-2 rounded text-white font-medium">
          {data.contradictionStatement}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-purple-400"
      />
    </div>
  );
});

PhysicalContradictionNode.displayName = 'PhysicalContradictionNode';
