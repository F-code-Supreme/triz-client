export interface CreateModulePayload {
  name: string;
  durationInMinutes: number;
  level: 'EASY' | 'MEDIUM' | 'HARD';
}
export interface UpdateModulePayload extends Partial<CreateModulePayload> {
  id: string;
}
