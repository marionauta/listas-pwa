export interface Item {
  id: string;
  name: string;
  completedAt: Date | null;
}

export type ItemId = Item["id"];
export type ItemChangePayload = Pick<Item, "id"> & Partial<Omit<Item, "id">>;
