import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowRightLeft } from 'lucide-react';
import { memo } from 'react';

import {
  BaseNode,
  BaseNodeContent,
} from '@/components/ui/react-flow/base-node';
import {
  NodeStatusIndicator,
  type NodeStatus,
} from '@/components/ui/react-flow/node-status-indicator';

interface TechnicalContradictionNodeData {
  direction: string;
  contradictionStatement: string;
  mk: string;
  status?: NodeStatus;
}

export const TechnicalContradictionNode = memo((props: NodeProps) => {
  const data = props.data as unknown as TechnicalContradictionNodeData;

  return (
    <NodeStatusIndicator status={data.status} variant="border">
      <BaseNode className="shadow-lg rounded-md bg-cyan-500 border-2 border-cyan-600 min-w-[280px] max-w-[350px]">
        <BaseNodeContent>
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 !bg-cyan-400"
          />

          <div className="flex items-start gap-2 mb-2">
            <ArrowRightLeft className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-bold text-sm mb-1">
                Mâu thuẫn Kỹ thuật ({data.mk})
              </div>
              <div className="text-white/90 text-xs font-medium">
                {data.direction}
              </div>
            </div>
          </div>

          <div className="bg-white/20 p-2 rounded text-white text-xs">
            {data.contradictionStatement}
          </div>

          <div className="flex gap-2 mt-3">
            <Handle
              type="source"
              position={Position.Bottom}
              id="improving"
              className="w-3 h-3 !bg-green-400 !left-[30%]"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              id="worsening"
              className="w-3 h-3 !bg-red-400 !left-[70%]"
            />
          </div>
        </BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  );
});

TechnicalContradictionNode.displayName = 'TechnicalContradictionNode';
