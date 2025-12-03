import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { memo } from 'react';

interface ParameterNodeData {
  name: string;
  number: number;
  reasoning: string;
  type: 'improving' | 'worsening';
}

export const ParameterNode = memo((props: NodeProps) => {
  const data = props.data as unknown as ParameterNodeData;

  const isImproving = data.type === 'improving';

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md border-2 min-w-[240px] max-w-[300px] ${
        isImproving
          ? 'bg-green-500 border-green-600'
          : 'bg-red-500 border-red-600'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 ${isImproving ? '!bg-green-400' : '!bg-red-400'}`}
      />

      <div className="flex items-start gap-2 mb-2">
        {isImproving ? (
          <ArrowUp className="w-5 h-5 text-white flex-shrink-0" />
        ) : (
          <ArrowDown className="w-5 h-5 text-white flex-shrink-0" />
        )}
        <div>
          <div className="text-white font-bold text-xs mb-0.5">
            {isImproving ? 'Thông số cải thiện' : 'Thông số xấu đi'}
          </div>
          <div className="text-white text-sm font-semibold">
            #{data.number} {data.name}
          </div>
        </div>
      </div>

      <div className="bg-white/20 p-2 rounded text-white text-xs">
        {data.reasoning}
      </div>
    </div>
  );
});

ParameterNode.displayName = 'ParameterNode';
