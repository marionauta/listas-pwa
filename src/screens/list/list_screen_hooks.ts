import { useCallback } from "react";
import { useLoaderData } from "react-router";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { ulid } from "ulid";
import type { ItemList as ItemListType } from "../../models/List";
import type { LoaderData } from "./list_screen_loader";
import { deleteAt } from "@automerge/automerge-repo/slim";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListAction = { action: string; payload?: any };

export function useList() {
  const { listId } = useLoaderData() as LoaderData;
  const [list, changeList] = useDocument<ItemListType>(listId);

  const dispatch = useCallback(
    (action: ListAction) => {
      switch (action.action) {
        case "create-item":
          if (!action.payload.name) {
            break;
          }
          changeList((doc) => {
            if (!doc.items) {
              doc.items = [] as unknown as ItemListType["items"];
            }
            doc.items.push({
              id: ulid(),
              name: action.payload.name,
              completedAt: null,
            });
          });
          break;
        case "update-item":
          changeList((doc) => {
            const index = doc.items.findIndex(
              (item) => item.id === action.payload.id,
            );
            if (index !== -1) {
              if ("name" in action.payload) {
                doc.items[index].name = action.payload.name;
              }
              if ("completedAt" in action.payload) {
                doc.items[index].completedAt = action.payload.completedAt;
              }
            }
          });
          break;
        case "delete-item":
          return changeList((list) => {
            const index = list.items.findIndex(
              (item) => item.id === action.payload.id,
            );
            if (index === -1) {
              return;
            }
            deleteAt(list.items, index);
          });
        case "delete-completed-items":
          changeList((doc) => {
            const indexesToDelete: number[] = [];
            for (let index = 0; index < doc.items.length; index++) {
              if (doc.items[index].completedAt !== null) {
                indexesToDelete.push(index);
              }
            }
            for (const index of indexesToDelete.reverse()) {
              deleteAt(doc.items, index);
            }
          });
          break;
      }
    },
    [changeList],
  );

  return { list, listId, dispatch };
}
