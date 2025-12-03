import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { memo } from 'react';

interface ElementNodeData {
  element: string;
  label: string;
}

export const ElementNode = memo((props: NodeProps) => {
  const data = props.data as unknown as ElementNodeData;
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-blue-500 border-2 border-blue-600 min-w-[200px]">
      <div className="flex items-center gap-2">
        <Box className="w-4 h-4 text-white" />
        <div className="text-white font-semibold text-sm">{data.element}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-400"
      />
    </div>
  );
});

ElementNode.displayName = 'ElementNode';
