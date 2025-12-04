import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Grid3x3 } from 'lucide-react';
import { memo } from 'react';

import {
  BaseNode,
  BaseNodeContent,
} from '@/components/ui/react-flow/base-node';
import {
  NodeStatusIndicator,
  type NodeStatus,
} from '@/components/ui/react-flow/node-status-indicator';

interface MatrixNodeData {
  improvingParam: number;
  worseningParam: number;
  improvingParamName: string;
  worseningParamName: string;
  status?: NodeStatus;
}

export const MatrixNode = memo((props: NodeProps) => {
  const data = props.data as unknown as MatrixNodeData;

  return (
    <NodeStatusIndicator status={data.status} variant="border">
      <BaseNode className="shadow-lg rounded-md bg-indigo-500 border-2 border-indigo-600 min-w-[280px] max-w-[350px]">
        <BaseNodeContent>
          <Handle
            type="target"
            position={Position.Top}
            id="improving"
            className="w-3 h-3 !bg-green-400 !left-[30%]"
          />
          <Handle
            type="target"
            position={Position.Top}
            id="worsening"
            className="w-3 h-3 !bg-red-400 !left-[70%]"
          />

          <div className="flex items-start gap-2 mb-3">
            <Grid3x3 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-bold text-sm mb-1">
                Ma trận TRIZ
              </div>
              <div className="text-white/90 text-xs">
                Tra cứu nguyên tắc giải quyết
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-green-500 p-2 rounded">
              <div className="text-white font-semibold mb-0.5">Cải thiện:</div>
              <div className="text-white">
                #{data.improvingParam} {data.improvingParamName}
              </div>
            </div>
            <div className="bg-red-500 p-2 rounded">
              <div className="text-white font-semibold mb-0.5">Xấu đi:</div>
              <div className="text-white">
                #{data.worseningParam} {data.worseningParamName}
              </div>
            </div>
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 !bg-indigo-300"
          />
        </BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  );
});

MatrixNode.displayName = 'MatrixNode';
