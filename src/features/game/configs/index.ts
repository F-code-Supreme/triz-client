export enum GamesEnumId {
  Merging = 'c03008e9-3a59-4f2b-abc5-e80417bcc3aa',
  Preliminary = 'eef1e555-1e47-48d9-84f9-bc0eb12873c4',
  Segmentation = '5ff257eb-2834-45bc-9630-cb52803c51d6',
}

export interface GameInfo {
  id: GamesEnumId;
  principle: number;
}

export const GamesInfo: Record<keyof typeof GamesEnumId, GameInfo> = {
  Merging: {
    id: GamesEnumId.Merging,
    principle: 5,
  },
  Preliminary: {
    id: GamesEnumId.Preliminary,
    principle: 10,
  },
  Segmentation: {
    id: GamesEnumId.Segmentation,
    principle: 1,
  },
};
