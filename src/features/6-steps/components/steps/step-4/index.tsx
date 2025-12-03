import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Panel,
} from '@xyflow/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import '@xyflow/react/dist/style.css';

import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import {
  MOCK_PHYSICAL_CONTRADICTIONS,
  MOCK_TECHNICAL_CONTRADICTIONS,
} from './mockData';
import { ElementNode } from './nodes/ElementNode';
import { ParameterNode } from './nodes/ParameterNode';
import { PhysicalContradictionNode } from './nodes/PhysicalContradictionNode';
import { TechnicalContradictionNode } from './nodes/TechnicalContradictionNode';
import ActionButtons from '../../ActionButtons';

interface Step4Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

const nodeTypes = {
  element: ElementNode,
  physicalContradiction: PhysicalContradictionNode,
  technicalContradiction: TechnicalContradictionNode,
  parameter: ParameterNode,
};

const elements = [
  'Vật liệu điện cực',
  'Dung dịch điện phân',
  'Màng ngăn (separator)',
  'Cell pin',
];

export const Step4FormulateContradiction = ({ onNext, onBack }: Step4Props) => {
  const { stepData } = useSixStepDataStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedPhysicalContradiction, setSelectedPhysicalContradiction] =
    useState<string | null>(null);
  const reactFlowContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to React Flow section on mount
  useEffect(() => {
    if (reactFlowContainerRef.current) {
      reactFlowContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Initialize nodes and edges
  useEffect(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    const horizontalSpacing = 400;
    const verticalSpacing = 200;

    // Level 1: Elements (top)
    elements.forEach((element, index) => {
      initialNodes.push({
        id: `element-${index}`,
        type: 'element',
        position: { x: index * horizontalSpacing + 100, y: 50 },
        data: { label: element, element },
      });
    });

    // Level 2: Physical Contradictions
    MOCK_PHYSICAL_CONTRADICTIONS.physicalContradictions.forEach((pc, index) => {
      const elementIndex = elements.findIndex(
        (e) =>
          pc.element.includes(e) || e.includes(pc.element.split('(')[0].trim()),
      );

      const xPosition =
        elementIndex >= 0
          ? elementIndex * horizontalSpacing + 100
          : index * horizontalSpacing + 100;

      initialNodes.push({
        id: `pc-${index}`,
        type: 'physicalContradiction',
        position: { x: xPosition, y: 50 + verticalSpacing },
        data: {
          ...pc,
          isSelected: false,
          onSelect: () => handleSelectPC(`pc-${index}`),
        },
      });

      // Connect to element
      if (elementIndex >= 0) {
        initialEdges.push({
          id: `edge-element-${elementIndex}-pc-${index}`,
          source: `element-${elementIndex}`,
          target: `pc-${index}`,
          animated: false,
          style: { stroke: '#94a3b8' },
        });
      }
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  const handleSelectPC = useCallback(
    (pcId: string) => {
      setSelectedPhysicalContradiction(pcId);

      // Update nodes to show selection
      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === 'physicalContradiction') {
            return {
              ...node,
              data: {
                ...node.data,
                isSelected: node.id === pcId,
              },
            };
          }
          return node;
        }),
      );

      // Add Technical Contradictions and Parameters
      const pcIndex = parseInt(pcId.split('-')[1]);
      const tc = MOCK_TECHNICAL_CONTRADICTIONS.technicalContradictions[0]; // Using first TC for demo

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const pcNode = nodes.find((n) => n.id === pcId);
      const baseX = pcNode?.position.x || 100;
      const baseY = pcNode?.position.y || 250;

      // Level 3: Technical Contradictions (MK1 and MK2)
      ['MK1', 'MK2'].forEach((mk, mkIndex) => {
        const tcId = `tc-${pcIndex}-${mk}`;
        const mkData = tc[mk as 'MK1' | 'MK2'];

        newNodes.push({
          id: tcId,
          type: 'technicalContradiction',
          position: {
            x: baseX + (mkIndex - 0.5) * 350,
            y: baseY + 200,
          },
          data: {
            direction: mkData.direction,
            contradictionStatement: mkData.contradictionStatement,
            mk,
          },
        });

        // Connect PC to TC
        newEdges.push({
          id: `edge-${pcId}-${tcId}`,
          source: pcId,
          target: tcId,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });

        // Level 4: Parameters (improving and worsening)
        const improvingParamId = `param-${tcId}-improving`;
        const worseningParamId = `param-${tcId}-worsening`;

        newNodes.push({
          id: improvingParamId,
          type: 'parameter',
          position: {
            x: baseX + (mkIndex - 0.5) * 350 - 150,
            y: baseY + 400,
          },
          data: {
            ...mkData.improvingParameter,
            type: 'improving',
          },
        });

        newNodes.push({
          id: worseningParamId,
          type: 'parameter',
          position: {
            x: baseX + (mkIndex - 0.5) * 350 + 150,
            y: baseY + 400,
          },
          data: {
            ...mkData.worseningParameter,
            type: 'worsening',
          },
        });

        // Connect TC to Parameters
        newEdges.push({
          id: `edge-${tcId}-${improvingParamId}`,
          source: tcId,
          target: improvingParamId,
          animated: false,
          style: { stroke: '#10b981', strokeWidth: 2 },
          label: 'Cải thiện',
        });

        newEdges.push({
          id: `edge-${tcId}-${worseningParamId}`,
          source: tcId,
          target: worseningParamId,
          animated: false,
          style: { stroke: '#ef4444', strokeWidth: 2 },
          label: 'Xấu đi',
        });
      });

      // Remove old TC and Parameter nodes
      setNodes((nds) => [
        ...nds.filter(
          (n) => !n.id.startsWith('tc-') && !n.id.startsWith('param-'),
        ),
        ...newNodes,
      ]);

      setEdges((eds) => [
        ...eds.filter(
          (e) =>
            !e.id.includes('tc-') &&
            !e.source.startsWith('tc-') &&
            !e.target.startsWith('tc-'),
        ),
        ...newEdges,
      ]);
    },
    [nodes, setNodes, setEdges],
  );

  const handleNext = () => {
    // Collect data and proceed
    onNext({
      contradiction: 'Physical and Technical Contradictions analyzed',
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="self-stretch text-center justify-start text-4xl font-bold leading-[48px] tracking-tight">
          Trả lời các câu hỏi
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Mục tiêu: {stepData.step2?.selectedGoal?.text}
          </div>
        </div>
      </div>

      <div
        ref={reactFlowContainerRef}
        className="flex-1 min-h-[700px] border rounded-lg overflow-hidden bg-background mx-4 scroll-mt-20"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'element':
                  return '#3b82f6';
                case 'physicalContradiction':
                  return node.data.isSelected ? '#f59e0b' : '#8b5cf6';
                case 'technicalContradiction':
                  return '#06b6d4';
                case 'parameter':
                  return node.data.type === 'improving' ? '#10b981' : '#ef4444';
                default:
                  return '#94a3b8';
              }
            }}
          />
          <Panel position="top-right" className="bg-background/80 p-2 rounded">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Phần tử</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded" />
                <span>Mâu thuẫn Lý học (ML)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded" />
                <span>Mâu thuẫn Kỹ thuật (MK)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Thông số cải thiện</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Thông số xấu đi</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <div className="max-w-4xl w-full mx-auto">
        <ActionButtons
          onBack={onBack}
          onNext={handleNext}
          disableNext={!selectedPhysicalContradiction}
        />
      </div>
    </div>
  );
};
