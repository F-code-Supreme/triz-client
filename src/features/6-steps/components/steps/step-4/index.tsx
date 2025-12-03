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
import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import '@xyflow/react/dist/style.css';

import {
  useStep4SuggestionMutation,
  useConvertMLtoMKMutation,
} from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import {
  EdgeColors,
  horizontalSpacing,
  NodeColors,
  ParameterColors,
  verticalSpacing,
} from './configs';
import ActionButtons from '../../ActionButtons';
import { ElementNode } from './nodes/ElementNode';
import { ParameterNode } from './nodes/ParameterNode';
import { PhysicalContradictionNode } from './nodes/PhysicalContradictionNode';
import { TechnicalContradictionNode } from './nodes/TechnicalContradictionNode';
import { NodeType, ParameterType, TechnicalContradictionKey } from './types';

import type { NodeStatus } from '@/components/ui/react-flow/node-status-indicator';
import type {
  PhysicalContradiction,
  TechnicalContradiction,
} from '@/features/6-steps/services/mutations/types';

interface Step4Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

const nodeTypes = {
  [NodeType.ELEMENT]: ElementNode,
  [NodeType.PHYSICAL_CONTRADICTION]: PhysicalContradictionNode,
  [NodeType.TECHNICAL_CONTRADICTION]: TechnicalContradictionNode,
  [NodeType.PARAMETER]: ParameterNode,
};

const LOADING_TEXT = 'Đang tải...';

export const Step4FormulateContradiction = ({ onNext, onBack }: Step4Props) => {
  const { stepData } = useSixStepDataStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedPhysicalContradiction, setSelectedPhysicalContradiction] =
    useState<string | null>(null);
  const [physicalContradictions, setPhysicalContradictions] = useState<
    PhysicalContradiction[]
  >([]);
  const [technicalContradictions, setTechnicalContradictions] = useState<
    TechnicalContradiction[]
  >([]);
  const [loadingStates, setLoadingStates] = useState<{
    elements: NodeStatus;
    physicalContradictions: NodeStatus;
    technicalContradictions: NodeStatus;
    parameters: NodeStatus;
  }>({
    elements: 'initial',
    physicalContradictions: 'initial',
    technicalContradictions: 'initial',
    parameters: 'initial',
  });
  const reactFlowContainerRef = useRef<HTMLDivElement>(null);

  const step4Mutation = useStep4SuggestionMutation();
  const convertMLtoMKMutation = useConvertMLtoMKMutation();

  // Auto-scroll to React Flow section on mount
  useEffect(() => {
    if (reactFlowContainerRef.current) {
      reactFlowContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Fetch physical contradictions when component mounts
  useEffect(() => {
    const fetchPhysicalContradictions = async () => {
      const step3Data = stepData.step3;
      if (!step3Data) {
        toast.error('Step 3 data is missing');
        return;
      }

      // Set loading state for elements and PC
      setLoadingStates((prev) => ({
        ...prev,
        elements: 'loading',
        physicalContradictions: 'loading',
      }));

      // Create placeholder nodes while loading
      const placeholderNodes: Node[] = [];
      const placeholderCount = 3; // Show 3 placeholder elements and PCs

      // Placeholder Elements
      for (let i = 0; i < placeholderCount; i++) {
        placeholderNodes.push({
          id: `element-placeholder-${i}`,
          type: NodeType.ELEMENT,
          position: { x: i * horizontalSpacing + 100, y: 50 },
          data: {
            label: LOADING_TEXT,
            element: LOADING_TEXT,
            status: 'loading' as NodeStatus,
          },
        });

        // Placeholder Physical Contradictions
        placeholderNodes.push({
          id: `pc-placeholder-${i}`,
          type: NodeType.PHYSICAL_CONTRADICTION,
          position: { x: i * horizontalSpacing + 100, y: 50 + verticalSpacing },
          data: {
            element: LOADING_TEXT,
            propertyDimension: LOADING_TEXT,
            stateA: LOADING_TEXT,
            stateB: LOADING_TEXT,
            benefitA: LOADING_TEXT,
            benefitB: LOADING_TEXT,
            contradictionStatement: 'Đang tạo mâu thuẫn lý học...',
            isSelected: false,
            onSelect: () => {},
            status: 'loading' as NodeStatus,
          },
        });
      }

      setNodes(placeholderNodes);

      try {
        // Convert requiredStates format
        const requiredStates: Record<string, string[]> = {};
        Object.entries(step3Data.requiredStates).forEach(([key, value]) => {
          requiredStates[key] = value.map((item) => item.text);
        });

        const response = await step4Mutation.mutateAsync({
          goal: stepData.step2?.selectedGoal?.text || '',
          systemIdentified: step3Data.systemIdentified,
          elements: step3Data.elements,
          requiredStates,
        });

        setPhysicalContradictions(response.physicalContradictions);

        // Set success state
        setLoadingStates((prev) => ({
          ...prev,
          elements: 'success',
          physicalContradictions: 'success',
        }));
      } catch (error) {
        console.error('Failed to get step 4 suggestions:', error);
        toast.error('Failed to generate physical contradictions');
        setLoadingStates((prev) => ({
          ...prev,
          elements: 'error',
          physicalContradictions: 'error',
        }));
      }
    };

    fetchPhysicalContradictions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elements = useMemo(
    () => physicalContradictions.map((pc) => pc.element),
    [physicalContradictions],
  );

  // Initialize nodes and edges
  useEffect(() => {
    if (physicalContradictions.length === 0) return;

    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // Level 1: Elements (top)
    elements.forEach((element, index) => {
      initialNodes.push({
        id: `element-${index}`,
        type: NodeType.ELEMENT,
        position: { x: index * horizontalSpacing + 100, y: 50 },
        data: {
          label: element,
          element,
          status: loadingStates.elements,
        },
      });
    });

    // Level 2: Physical Contradictions
    physicalContradictions.forEach((pc, index) => {
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
        type: NodeType.PHYSICAL_CONTRADICTION,
        position: { x: xPosition, y: 50 + verticalSpacing },
        data: {
          ...pc,
          isSelected: false,
          onSelect: () => handleSelectPC(`pc-${index}`),
          status: loadingStates.physicalContradictions,
        },
      });

      // Connect to element
      if (elementIndex >= 0) {
        initialEdges.push({
          id: `edge-element-${elementIndex}-pc-${index}`,
          source: `element-${elementIndex}`,
          target: `pc-${index}`,
          animated: false,
          style: { stroke: EdgeColors.elementToPC },
        });
      }
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    physicalContradictions,
    loadingStates.elements,
    loadingStates.physicalContradictions,
  ]);

  const handleSelectPC = useCallback(
    async (pcId: string) => {
      setSelectedPhysicalContradiction(pcId);

      // Update nodes to show selection
      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === NodeType.PHYSICAL_CONTRADICTION) {
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

      // Set loading state for TC and Parameters
      setLoadingStates((prev) => ({
        ...prev,
        technicalContradictions: 'loading',
        parameters: 'loading',
      }));

      // Get the position of the selected PC for placeholder positioning
      const pcNode = nodes.find((n) => n.id === pcId);
      const baseX = pcNode?.position.x || 100;
      const baseY = pcNode?.position.y || 250;

      // Create placeholder nodes for TC and Parameters while loading
      const placeholderNodes: Node[] = [];
      const placeholderEdges: Edge[] = [];

      // Create 2 placeholder Technical Contradictions (MK1 and MK2)
      [0, 1].forEach((mkIndex) => {
        const tcId = `tc-placeholder-${mkIndex}`;

        placeholderNodes.push({
          id: tcId,
          type: NodeType.TECHNICAL_CONTRADICTION,
          position: {
            x: baseX + (mkIndex - 0.5) * 700,
            y: baseY + 300,
          },
          data: {
            direction: 'Đang phân tích...',
            contradictionStatement: 'Đang tạo mâu thuẫn kỹ thuật...',
            mk: `MK${mkIndex + 1}`,
            status: 'loading' as NodeStatus,
          },
        });

        // Connect PC to placeholder TC
        placeholderEdges.push({
          id: `edge-${pcId}-${tcId}`,
          source: pcId,
          target: tcId,
          animated: true,
          style: { stroke: EdgeColors.pcToTC, strokeWidth: 2 },
        });

        // Create placeholder Parameters
        const improvingParamId = `param-${tcId}-improving`;
        const worseningParamId = `param-${tcId}-worsening`;

        placeholderNodes.push({
          id: improvingParamId,
          type: NodeType.PARAMETER,
          position: {
            x: baseX + (mkIndex - 0.5) * 700 - 200,
            y: baseY + 600,
          },
          data: {
            name: LOADING_TEXT,
            number: '?',
            reasoning: 'Đang phân tích thông số...',
            type: ParameterType.IMPROVING,
            status: 'loading' as NodeStatus,
          },
        });

        placeholderNodes.push({
          id: worseningParamId,
          type: NodeType.PARAMETER,
          position: {
            x: baseX + (mkIndex - 0.5) * 700 + 200,
            y: baseY + 600,
          },
          data: {
            name: LOADING_TEXT,
            number: '?',
            reasoning: 'Đang phân tích thông số...',
            type: ParameterType.WORSENING,
            status: 'loading' as NodeStatus,
          },
        });

        // Connect TC to placeholder Parameters
        placeholderEdges.push({
          id: `edge-${tcId}-${improvingParamId}`,
          source: tcId,
          sourceHandle: 'improving',
          target: improvingParamId,
          style: { stroke: EdgeColors.tcToImproving, strokeWidth: 2 },
          label: 'Cải thiện',
        });

        placeholderEdges.push({
          id: `edge-${tcId}-${worseningParamId}`,
          source: tcId,
          sourceHandle: 'worsening',
          target: worseningParamId,
          style: { stroke: EdgeColors.tcToWorsening, strokeWidth: 2 },
          label: 'Xấu đi',
        });
      });

      // Add placeholder nodes immediately
      setNodes((nds) => [
        ...nds.filter(
          (n) => !n.id.startsWith('tc-') && !n.id.startsWith('param-'),
        ),
        ...placeholderNodes,
      ]);

      setEdges((eds) => [
        ...eds.filter(
          (e) =>
            !e.id.includes('tc-') &&
            !e.source.startsWith('tc-') &&
            !e.target.startsWith('tc-'),
        ),
        ...placeholderEdges,
      ]);

      try {
        // Get the selected physical contradiction
        const pcIndex = parseInt(pcId.split('-')[1]);
        const selectedPC = physicalContradictions[pcIndex];

        // Call API to convert ML to MK
        const response = await convertMLtoMKMutation.mutateAsync({
          physicalContradictions: [selectedPC],
        });

        setTechnicalContradictions(response.technicalContradictions);

        // Add Technical Contradictions and Parameters
        const tc = response.technicalContradictions[0];

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        const pcNode = nodes.find((n) => n.id === pcId);
        const baseX = pcNode?.position.x || 100;
        const baseY = pcNode?.position.y || 250;

        // Level 3: Technical Contradictions (MK1 and MK2)
        [TechnicalContradictionKey.MK1, TechnicalContradictionKey.MK2].forEach(
          (mk, mkIndex) => {
            const tcId = `tc-${pcIndex}-${mk}`;
            const mkData = tc[mk as 'MK1' | 'MK2'];

            newNodes.push({
              id: tcId,
              type: NodeType.TECHNICAL_CONTRADICTION,
              position: {
                x: baseX + (mkIndex - 0.5) * 700,
                y: baseY + 300,
              },
              data: {
                direction: mkData.direction,
                contradictionStatement: mkData.contradictionStatement,
                mk,
                status: loadingStates.technicalContradictions,
              },
            });

            // Connect PC to TC
            newEdges.push({
              id: `edge-${pcId}-${tcId}`,
              source: pcId,
              target: tcId,
              animated: true,
              style: { stroke: EdgeColors.pcToTC, strokeWidth: 2 },
            });

            // Level 4: Parameters (improving and worsening)
            const improvingParamId = `param-${tcId}-improving`;
            const worseningParamId = `param-${tcId}-worsening`;

            newNodes.push({
              id: improvingParamId,
              type: NodeType.PARAMETER,
              position: {
                x: baseX + (mkIndex - 0.5) * 700 - 200,
                y: baseY + 600,
              },
              data: {
                ...mkData.improvingParameter,
                type: ParameterType.IMPROVING,
                status: loadingStates.parameters,
              },
            });

            newNodes.push({
              id: worseningParamId,
              type: NodeType.PARAMETER,
              position: {
                x: baseX + (mkIndex - 0.5) * 700 + 200,
                y: baseY + 600,
              },
              data: {
                ...mkData.worseningParameter,
                type: ParameterType.WORSENING,
                status: loadingStates.parameters,
              },
            });

            // Connect TC to Parameters
            newEdges.push({
              id: `edge-${tcId}-${improvingParamId}`,
              source: tcId,
              sourceHandle: 'improving',
              target: improvingParamId,
              style: { stroke: EdgeColors.tcToImproving, strokeWidth: 2 },
              label: 'Cải thiện',
            });

            newEdges.push({
              id: `edge-${tcId}-${worseningParamId}`,
              source: tcId,
              sourceHandle: 'worsening',
              target: worseningParamId,
              style: { stroke: EdgeColors.tcToWorsening, strokeWidth: 2 },
              label: 'Xấu đi',
            });
          },
        );

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

        // Set success state
        setLoadingStates((prev) => ({
          ...prev,
          technicalContradictions: 'success',
          parameters: 'success',
        }));
      } catch (error) {
        console.error('Failed to convert ML to MK:', error);
        toast.error('Failed to generate technical contradictions');
        setLoadingStates((prev) => ({
          ...prev,
          technicalContradictions: 'error',
          parameters: 'error',
        }));
      }
    },
    [
      nodes,
      setNodes,
      setEdges,
      physicalContradictions,
      convertMLtoMKMutation,
      loadingStates.technicalContradictions,
      loadingStates.parameters,
    ],
  );

  const handleNext = () => {
    if (!selectedPhysicalContradiction) {
      toast.error('Vui lòng chọn một mâu thuẫn lý học');
      return;
    }

    const pcIndex = parseInt(selectedPhysicalContradiction.split('-')[1]);

    // Collect data and proceed
    onNext({
      physicalContradictions,
      selectedPhysicalContradictionIndex: pcIndex,
      technicalContradictions,
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
                case NodeType.ELEMENT:
                  return NodeColors.element;
                case NodeType.PHYSICAL_CONTRADICTION:
                  return node.data.isSelected
                    ? NodeColors.physicalContradictionSelected
                    : NodeColors.physicalContradiction;
                case NodeType.TECHNICAL_CONTRADICTION:
                  return NodeColors.technicalContradiction;
                case NodeType.PARAMETER:
                  return node.data.type === ParameterType.IMPROVING
                    ? ParameterColors.improving
                    : ParameterColors.worsening;
                default:
                  return NodeColors.default;
              }
            }}
          />
          <Panel position="top-right" className="bg-background/80 p-2 rounded">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: NodeColors.element }}
                />
                <span>Phần tử</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: NodeColors.physicalContradiction }}
                />
                <span>Mâu thuẫn Lý học (ML)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: NodeColors.technicalContradiction }}
                />
                <span>Mâu thuẫn Kỹ thuật (MK)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: ParameterColors.improving }}
                />
                <span>Thông số cải thiện</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: ParameterColors.worsening }}
                />
                <span>Thông số xấu đi</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <div className="max-w-4xl w-full mx-auto pb-4">
        <ActionButtons
          onBack={onBack}
          onNext={handleNext}
          disableNext={!selectedPhysicalContradiction}
        />
      </div>
    </div>
  );
};
