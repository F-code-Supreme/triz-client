export interface CreateModulePayload {
  name: string;
  level: 'EASY' | 'MEDIUM' | 'HARD';
}
export interface UpdateModulePayload extends Partial<CreateModulePayload> {
  id: string;
}
