import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Lightbulb } from 'lucide-react';
import { memo } from 'react';

import {
  BaseNode,
  BaseNodeContent,
} from '@/components/ui/react-flow/base-node';
import {
  NodeStatusIndicator,
  type NodeStatus,
} from '@/components/ui/react-flow/node-status-indicator';
import {
  NodeTooltip,
  NodeTooltipContent,
  NodeTooltipTrigger,
} from '@/components/ui/react-flow/node-tooltip';
import { principlesData } from '@/pages/main/public/learn-triz/components/principles-data';

interface PrincipleNodeData {
  id: number;
  name: string;
  priority: number;
  status?: NodeStatus;
}

export const PrincipleNode = memo((props: NodeProps) => {
  const data = props.data as unknown as PrincipleNodeData;

  // Construct the principle image URL
  const principleImageUrl = principlesData.find(
    (p) => p.number === data.id,
  )?.image;

  return (
    <NodeStatusIndicator status={data.status} variant="border">
      <NodeTooltip>
        <NodeTooltipTrigger>
          <BaseNode className="shadow-md rounded-md bg-yellow-500 border-2 border-yellow-600 min-w-[220px] max-w-[280px] cursor-help">
            <BaseNodeContent>
              <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-yellow-400"
              />

              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-white font-bold text-xs mb-1">
                    Nguyên tắc #{data.id}
                  </div>
                  <div className="text-white text-sm font-semibold leading-tight">
                    {data.name}
                  </div>
                  <div className="text-white/80 text-xs mt-1">
                    Độ ưu tiên: {data.priority}
                  </div>
                </div>
              </div>
            </BaseNodeContent>
          </BaseNode>
        </NodeTooltipTrigger>
        <NodeTooltipContent
          position={Position.Right}
          className="max-w-[250px] p-0 !bg-background !text-foreground"
        >
          <div className="p-3">
            <div className="font-semibold mb-2">
              Nguyên tắc #{data.id}: {data.name}
            </div>
            <img
              src={principleImageUrl}
              alt={`Nguyên tắc ${data.id}: ${data.name}`}
              className="w-[250px] h-auto rounded"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML += `
                  <div class="text-sm text-muted-foreground">
                    Hình minh họa đang được cập nhật
                  </div>
                `;
              }}
            />
          </div>
        </NodeTooltipContent>
      </NodeTooltip>
    </NodeStatusIndicator>
  );
});

PrincipleNode.displayName = 'PrincipleNode';
