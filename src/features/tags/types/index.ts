export type UUID = string;
export type ISODateString = string;

export interface Tag {
  id: UUID;
  name: string;
  description: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
