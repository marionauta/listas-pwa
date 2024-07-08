import type { List } from "@automerge/automerge";
import type { Item } from "./Item";

export interface ItemList {
  name: string;
  items: List<Item>;
}
