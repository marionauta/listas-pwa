import type { List as AList } from "@automerge/automerge";
import type { Item } from "./Item";

export interface List {
  id: string;
  name: string;
}

export interface ItemList {
  name: string;
  items: AList<Item>;
}
