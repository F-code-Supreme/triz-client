import { NodeType } from '../types';

export const NodeColors: Record<
  NodeType | 'physicalContradictionSelected' | 'default',
  string
> = {
  [NodeType.ELEMENT]: '#3b82f6', // blue-500
  [NodeType.PHYSICAL_CONTRADICTION]: '#8b5cf6', // purple-500
  physicalContradictionSelected: '#f59e0b', // amber-500
  [NodeType.TECHNICAL_CONTRADICTION]: '#06b6d4', // cyan-500
  [NodeType.PARAMETER]: '#10b981', // green-500 (improving default)
  [NodeType.MATRIX]: '#6366f1', // indigo-500
  [NodeType.PRINCIPLE]: '#eab308', // yellow-500
  default: '#94a3b8', // slate-400
};

export const ParameterColors = {
  improving: '#10b981', // green-500
  worsening: '#ef4444', // red-500
};

export const EdgeColors = {
  elementToPC: '#94a3b8', // slate-400
  pcToTC: '#3b82f6', // blue-500
  tcToImproving: '#10b981', // green-500
  tcToWorsening: '#ef4444', // red-500
};

export const horizontalSpacing = 500;
export const verticalSpacing = 200;
