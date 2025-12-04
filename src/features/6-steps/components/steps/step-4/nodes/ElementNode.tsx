import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { memo } from 'react';

import {
  BaseNode,
  BaseNodeContent,
} from '@/components/ui/react-flow/base-node';
import {
  NodeStatusIndicator,
  type NodeStatus,
} from '@/components/ui/react-flow/node-status-indicator';

interface ElementNodeData {
  element: string;
  label: string;
  status?: NodeStatus;
}

export const ElementNode = memo((props: NodeProps) => {
  const data = props.data as unknown as ElementNodeData;
  return (
    <NodeStatusIndicator status={data.status} variant="border">
      <BaseNode className="shadow-md rounded-md bg-blue-500 border-2 border-blue-600 min-w-[200px]">
        <BaseNodeContent>
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-white" />
            <div className="text-white font-semibold text-sm">
              {data.element}
            </div>
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 !bg-blue-400"
          />
        </BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  );
});

ElementNode.displayName = 'ElementNode';
