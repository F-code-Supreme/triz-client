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
import { useGetPrinciplesLookupQuery } from '@/features/6-steps/services/queries';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import {
  EdgeColors,
  horizontalSpacing,
  NodeColors,
  ParameterColors,
  verticalSpacing,
} from './configs';
import ActionButtons from '../../action-buttons';
import { ElementNode } from './nodes/ElementNode';
import { MatrixNode } from './nodes/MatrixNode';
import { ParameterNode } from './nodes/ParameterNode';
import { PhysicalContradictionNode } from './nodes/PhysicalContradictionNode';
import { PrincipleNode } from './nodes/PrincipleNode';
import { TechnicalContradictionNode } from './nodes/TechnicalContradictionNode';
import { NodeType, ParameterType, TechnicalContradictionKey } from './types';

import type { NodeStatus } from '@/components/ui/react-flow/node-status-indicator';
import type { TechnicalContradiction } from '@/features/6-steps/services/mutations/types';
import type { PhysicalContradiction } from '@/features/6-steps/types';
// import type { IGetPrinciplesLookupDataItem } from '@/features/6-steps/services/queries/types';

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
  [NodeType.MATRIX]: MatrixNode,
  [NodeType.PRINCIPLE]: PrincipleNode,
};

const LOADING_TEXT = 'Đang tải...';

export const Step4FormulateContradiction = ({ onNext, onBack }: Step4Props) => {
  const { stepData } = useSixStepDataStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedPhysicalContradiction, setSelectedPhysicalContradiction] =
    useState<string | null>(null);
  const [selectedTechnicalContradiction, setSelectedTechnicalContradiction] =
    useState<string | null>(null);
  const [physicalContradictions, setPhysicalContradictions] = useState<
    PhysicalContradiction[]
  >([]);
  const [technicalContradictions, setTechnicalContradictions] = useState<
    TechnicalContradiction[]
  >([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState<number[]>([]);
  const [matrixParams, setMatrixParams] = useState<{
    improving: number;
    worsening: number;
    improvingName: string;
    worseningName: string;
  } | null>(null);
  const [loadingStates, setLoadingStates] = useState<{
    elements: NodeStatus;
    physicalContradictions: NodeStatus;
    technicalContradictions: NodeStatus;
    parameters: NodeStatus;
    matrix: NodeStatus;
    principles: NodeStatus;
  }>({
    elements: 'initial',
    physicalContradictions: 'initial',
    technicalContradictions: 'initial',
    parameters: 'initial',
    matrix: 'initial',
    principles: 'initial',
  });
  const reactFlowContainerRef = useRef<HTMLDivElement>(null);

  const step4Mutation = useStep4SuggestionMutation();
  const convertMLtoMKMutation = useConvertMLtoMKMutation();

  // Use the principles lookup query
  const principlesQuery = useGetPrinciplesLookupQuery(
    matrixParams?.improving,
    matrixParams?.worsening,
  );

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
      const step4Data = stepData.step4;

      // If we have step4 data from store (coming back from step 5), restore it
      if (step4Data?.physicalContradictions) {
        setPhysicalContradictions(step4Data.physicalContradictions);

        if (step4Data.technicalContradictions) {
          setTechnicalContradictions(step4Data.technicalContradictions);
        }

        if (step4Data.selectedPrinciples) {
          setSelectedPrinciples(step4Data.selectedPrinciples.map((p) => p.id));
        }

        if (step4Data.selectedTechnicalContradictionId) {
          setSelectedTechnicalContradiction(
            step4Data.selectedTechnicalContradictionId,
          );
        }

        if (step4Data.matrixParams) {
          setMatrixParams(step4Data.matrixParams);
        }

        // Set success state since data is already loaded
        setLoadingStates((prev) => ({
          ...prev,
          elements: 'success',
          physicalContradictions: 'success',
          technicalContradictions: step4Data.technicalContradictions
            ? 'success'
            : 'initial',
          parameters: step4Data.technicalContradictions ? 'success' : 'initial',
          matrix: step4Data.matrixParams ? 'success' : 'initial',
          principles: step4Data.selectedPrinciples ? 'success' : 'initial',
        }));

        return;
      }

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
          systemIdentified: step3Data.systemIdentified,
          elements: step3Data.elements,
          objectType: step3Data.objectType || 'Moving',
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

  const uniqueElements = useMemo(() => {
    const elementSet = new Set(physicalContradictions.map((pc) => pc.element));
    return Array.from(elementSet);
  }, [physicalContradictions]);

  // Initialize nodes and edges
  useEffect(() => {
    if (physicalContradictions.length === 0) return;

    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // Level 1: Elements (top) - Only unique elements
    uniqueElements.forEach((element, index) => {
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
      const elementIndex = uniqueElements.findIndex(
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

  // Restore selected PC when coming back from step 5
  useEffect(() => {
    const step4Data = stepData.step4;
    if (
      step4Data?.selectedPhysicalContradictionIndex !== undefined &&
      physicalContradictions.length > 0 &&
      !selectedPhysicalContradiction
    ) {
      const pcIndex = step4Data.selectedPhysicalContradictionIndex;
      const pcId = `pc-${pcIndex}`;

      // Only trigger if we haven't already selected this PC
      handleSelectPC(pcId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    physicalContradictions,
    stepData.step4?.selectedPhysicalContradictionIndex,
  ]);

  const handleSelectPC = useCallback(
    async (pcId: string) => {
      setSelectedPhysicalContradiction(pcId);
      setSelectedTechnicalContradiction(null);
      setMatrixParams(null);
      setSelectedPrinciples([]);

      // Get the position of the selected PC for placeholder positioning
      let baseX = 100;
      let baseY = 250;

      // Update nodes to show selection and capture PC position
      // Also remove TC, Parameters, Matrix, and Principle nodes
      setNodes((nds) => {
        const pcNode = nds.find((n) => n.id === pcId);
        if (pcNode) {
          baseX = pcNode.position.x;
          baseY = pcNode.position.y;
        }

        return nds
          .filter(
            (n) =>
              !n.id.startsWith('tc-') &&
              !n.id.startsWith('param-') &&
              !n.id.startsWith('matrix-') &&
              !n.id.startsWith('principle-'),
          )
          .map((node) => {
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
          });
      });

      // Remove edges connected to TC, Parameters, Matrix, and Principles
      setEdges((eds) =>
        eds.filter(
          (e) =>
            !e.id.includes('tc-') &&
            !e.source.startsWith('tc-') &&
            !e.target.startsWith('tc-') &&
            !e.id.includes('param-') &&
            !e.source.startsWith('param-') &&
            !e.target.startsWith('param-') &&
            !e.id.includes('matrix-') &&
            !e.source.startsWith('matrix-') &&
            !e.target.startsWith('matrix-') &&
            !e.id.includes('principle-') &&
            !e.source.startsWith('principle-') &&
            !e.target.startsWith('principle-'),
        ),
      );

      // Set loading state for TC and Parameters
      setLoadingStates((prev) => ({
        ...prev,
        technicalContradictions: 'loading',
        parameters: 'loading',
      }));

      // Wait for next tick to ensure baseX and baseY are captured
      await new Promise((resolve) => setTimeout(resolve, 0));

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
          systemInfo: {
            objectType: stepData.step3?.objectType || 'Moving',
          },
          physicalContradictions: [selectedPC],
        });

        setTechnicalContradictions(response.technicalContradictions);

        // Add Technical Contradictions and Parameters
        const tc = response.technicalContradictions[0];

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        // Use the baseX and baseY captured earlier
        // (these were already calculated from the selected PC node)

        // Level 3: Technical Contradictions (MK1 and MK2)
        [TechnicalContradictionKey.MK1, TechnicalContradictionKey.MK2].forEach(
          (mk, mkIndex) => {
            const tcId = `tc-${pcIndex}-${mk}`;
            const mkData = tc[mk as 'mk1' | 'mk2'];

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
                isSelected: false,
                onSelect: () => handleSelectTC(tcId, mkData),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      setNodes,
      setEdges,
      physicalContradictions,
      convertMLtoMKMutation,
      loadingStates.technicalContradictions,
      loadingStates.parameters,
    ],
  );

  const handleSelectTC = useCallback(
    async (tcId: string, mkData: TechnicalContradiction['mk1']) => {
      setSelectedTechnicalContradiction(tcId);
      setSelectedPrinciples([]);

      // Variables to capture positions
      let baseX = 100;
      let baseY = 550;
      let improvingParamNode: Node | undefined;
      let worseningParamNode: Node | undefined;

      // Get the related parameter nodes to connect to matrix
      const improvingParamId = `param-${tcId}-improving`;
      const worseningParamId = `param-${tcId}-worsening`;

      // Update nodes to show TC selection and capture positions
      // Also remove existing Matrix and Principle nodes
      setNodes((nds) => {
        const tcNode = nds.find((n) => n.id === tcId);
        if (tcNode) {
          baseX = tcNode.position.x;
          baseY = tcNode.position.y;
        }

        // Find the parameter nodes to position matrix between them
        improvingParamNode = nds.find((n) => n.id === improvingParamId);
        worseningParamNode = nds.find((n) => n.id === worseningParamId);

        return nds
          .filter(
            (n) =>
              !n.id.startsWith('matrix-') && !n.id.startsWith('principle-'),
          )
          .map((node) => {
            if (node.type === NodeType.TECHNICAL_CONTRADICTION) {
              return {
                ...node,
                data: {
                  ...node.data,
                  isSelected: node.id === tcId,
                },
              };
            }
            return node;
          });
      });

      // Remove edges connected to Matrix and Principles
      setEdges((eds) =>
        eds.filter(
          (e) =>
            !e.id.includes('matrix-') &&
            !e.source.startsWith('matrix-') &&
            !e.target.startsWith('matrix-') &&
            !e.id.includes('principle-') &&
            !e.source.startsWith('principle-') &&
            !e.target.startsWith('principle-'),
        ),
      );

      // Set loading state for Matrix and Principles
      setLoadingStates((prev) => ({
        ...prev,
        matrix: 'loading',
        principles: 'loading',
      }));

      // Extract parameters
      const improvingParam = parseInt(mkData.improvingParameter.number);
      const worseningParam = parseInt(mkData.worseningParameter.number);

      setMatrixParams({
        improving: improvingParam,
        worsening: worseningParam,
        improvingName: mkData.improvingParameter.name,
        worseningName: mkData.worseningParameter.name,
      });

      // Wait for next tick to ensure positions are captured
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Calculate matrix position: centered horizontally between the two parameters, below them
      const matrixX =
        improvingParamNode && worseningParamNode
          ? (improvingParamNode.position.x + worseningParamNode.position.x) / 2
          : baseX;
      const matrixY = improvingParamNode
        ? improvingParamNode.position.y + 250
        : baseY + 850;

      // Create placeholder Matrix node
      const matrixId = `matrix-${tcId}`;
      const placeholderMatrixNode: Node = {
        id: matrixId,
        type: NodeType.MATRIX,
        position: {
          x: matrixX,
          y: matrixY,
        },
        data: {
          improvingParam: improvingParam,
          worseningParam: worseningParam,
          improvingParamName: mkData.improvingParameter.name,
          worseningParamName: mkData.worseningParameter.name,
          status: 'loading' as NodeStatus,
        },
      };

      // Create edges from parameters to matrix
      const matrixEdges: Edge[] = [
        {
          id: `edge-${improvingParamId}-${matrixId}`,
          source: improvingParamId,
          target: matrixId,
          targetHandle: 'improving',
          style: { stroke: EdgeColors.tcToImproving, strokeWidth: 2 },
        },
        {
          id: `edge-${worseningParamId}-${matrixId}`,
          source: worseningParamId,
          target: matrixId,
          targetHandle: 'worsening',
          style: { stroke: EdgeColors.tcToWorsening, strokeWidth: 2 },
        },
      ];

      // Create placeholder principle nodes (show 3 placeholders)
      const placeholderPrinciples: Node[] = [];
      for (let i = 0; i < 3; i++) {
        placeholderPrinciples.push({
          id: `principle-placeholder-${i}`,
          type: NodeType.PRINCIPLE,
          position: {
            x: matrixX - 300 + i * 300,
            y: matrixY + 300,
          },
          data: {
            id: 0,
            name: LOADING_TEXT,
            priority: 0,
            status: 'loading' as NodeStatus,
          },
        });

        // Connect matrix to placeholder principles
        matrixEdges.push({
          id: `edge-${matrixId}-principle-placeholder-${i}`,
          source: matrixId,
          target: `principle-placeholder-${i}`,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        });
      }

      // Add placeholder nodes immediately
      setNodes((nds) => [
        ...nds,
        placeholderMatrixNode,
        ...placeholderPrinciples,
      ]);

      setEdges((eds) => [...eds, ...matrixEdges]);

      try {
        // Matrix params have been set, principles query will auto-fetch
        // The useEffect below will handle the response
        setLoadingStates((prev) => ({
          ...prev,
          matrix: 'success',
        }));
      } catch (error) {
        console.error('Failed to setup matrix:', error);
        toast.error('Failed to setup TRIZ matrix');
        setLoadingStates((prev) => ({
          ...prev,
          matrix: 'error',
          principles: 'error',
        }));
      }
    },
    [setNodes, setEdges],
  );

  // Handle principles query response
  useEffect(() => {
    if (
      !principlesQuery.data ||
      !selectedTechnicalContradiction ||
      !matrixParams
    ) {
      return;
    }

    // Find the matrix node and TC node
    const matrixNode = nodes.find((n) => n.type === NodeType.MATRIX);
    const tcNode = nodes.find((n) => n.id === selectedTechnicalContradiction);

    if (!matrixNode || !tcNode) return;

    const tcId = selectedTechnicalContradiction;
    const matrixId = matrixNode.id;
    const matrixX = matrixNode.position.x || 100;
    const matrixY = matrixNode.position.y || 850;

    // Create actual principle nodes
    const principleNodes: Node[] = principlesQuery.data.map((item, index) => ({
      id: `principle-${tcId}-${item.principle.id}`,
      type: NodeType.PRINCIPLE,
      position: {
        x:
          matrixX - (300 * (principlesQuery.data.length - 1)) / 2 + index * 300,
        y: matrixY + 300,
      },
      data: {
        id: item.principle.id,
        name: item.principle.name,
        status: 'success' as NodeStatus,
        isSelected: selectedPrinciples.includes(item.principle.id),
        onSelect: () => {
          setSelectedPrinciples((prev) =>
            prev.includes(item.principle.id)
              ? prev.filter((id) => id !== item.principle.id)
              : [...prev, item.principle.id],
          );
        },
      },
    }));

    // Create edges from matrix to principles
    const principleEdges: Edge[] = principlesQuery.data.map((item) => ({
      id: `edge-${matrixId}-principle-${item.principle.id}`,
      source: matrixId,
      target: `principle-${tcId}-${item.principle.id}`,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    }));

    // Remove placeholder principles and add actual ones
    setNodes((nds) =>
      [
        ...nds.filter((n) => !n.id.startsWith('principle-')),
        ...principleNodes,
      ].map((node) => {
        // Update matrix node status to success when principles load
        if (node.type === NodeType.MATRIX) {
          return {
            ...node,
            data: {
              ...node.data,
              status: 'success' as NodeStatus,
            },
          };
        }
        return node;
      }),
    );

    setEdges((eds) => [
      ...eds.filter(
        (e) =>
          !e.id.includes('principle-') &&
          !e.source.startsWith('principle-') &&
          !e.target.startsWith('principle-'),
      ),
      ...principleEdges,
    ]);

    // Set success state
    setLoadingStates((prev) => ({
      ...prev,
      matrix: 'success',
      principles: 'success',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    principlesQuery.data,
    selectedTechnicalContradiction,
    matrixParams,
    selectedPrinciples,
    setNodes,
    setEdges,
  ]);

  // Handle principles query error
  useEffect(() => {
    if (principlesQuery.error && matrixParams) {
      toast.error('Failed to fetch principles from TRIZ matrix');
      setLoadingStates((prev) => ({
        ...prev,
        principles: 'error',
      }));
    }
  }, [principlesQuery.error, matrixParams]);

  const handleNext = () => {
    if (!selectedPhysicalContradiction) {
      toast.error('Vui lòng chọn một mâu thuẫn lý học');
      return;
    }

    if (selectedPrinciples.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nguyên tắc để tiếp tục');
      return;
    }

    const pcIndex = parseInt(selectedPhysicalContradiction.split('-')[1]);
    const selectedPC = physicalContradictions[pcIndex];

    // Collect data and proceed
    onNext({
      physicalContradictions,
      selectedPhysicalContradictionIndex: pcIndex,
      selectedPhysicalContradiction: selectedPC,
      technicalContradictions,
      selectedTechnicalContradictionId: selectedTechnicalContradiction,
      matrixParams,
      selectedPrinciples: selectedPrinciples.map((id) => ({
        id,
        name:
          principlesQuery.data?.find((p) => p.principle.id === id)?.principle
            .name || '',
        priority:
          principlesQuery.data?.find((p) => p.principle.id === id)?.priority ||
          0,
        description:
          principlesQuery.data?.find((p) => p.principle.id === id)?.principle
            .description || '',
        examples:
          principlesQuery.data?.find((p) => p.principle.id === id)?.principle
            .examples || [],
      })),
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto flex flex-col gap-4">
        <div className="self-stretch text-center justify-start text-4xl font-bold leading-[48px] tracking-tight">
          Trả lời các câu hỏi
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Mục tiêu: {stepData.step2?.goal}
          </div>
        </div>
      </div>

      <div
        ref={reactFlowContainerRef}
        className="flex-1 min-h-[92vh] border rounded-lg overflow-hidden bg-background mx-4 scroll-mt-[66px]"
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
                case NodeType.MATRIX:
                  return NodeColors.matrix;
                case NodeType.PRINCIPLE:
                  return NodeColors.principle;
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
                <span>Mâu thuẫn Vật lý (ML)</span>
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
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: NodeColors.matrix }}
                />
                <span>Ma trận TRIZ</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: NodeColors.principle }}
                />
                <span>Nguyên tắc giải quyết</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl w-full mx-auto pb-4">
        <ActionButtons
          onBack={onBack}
          onNext={handleNext}
          disableNext={
            !selectedPhysicalContradiction || selectedPrinciples.length === 0
          }
        />
      </div>
    </div>
  );
};
