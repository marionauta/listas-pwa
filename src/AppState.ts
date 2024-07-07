import { useCallback, useReducer } from "react";
import { Item } from "./models/Item";
import { ItemList, List } from "./models/List";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { List as AList } from "@automerge/automerge";

interface UIState {
  selectedListId: AnyDocumentId | undefined;
}

export interface AppState {
  lists: Record<List["id"], List>;
  items: Record<Item["id"], Item>;
  ui: UIState;
}

const initialState: AppState = {
  lists: {},
  items: {},
  ui: {
    selectedListId: "2mynQrvC4FR8EDMYVpsLWnahuYd1" as AnyDocumentId,
  },
};

export type AppAction = { type: string; payload: any };
export type ServerAction = { action: string; payload?: any };

export function useAppState() {
  const [selectedList, changeList] = useDocument<ItemList>(
    "2mynQrvC4FR8EDMYVpsLWnahuYd1" as AnyDocumentId,
  );

  const sendJsonMessage = useCallback(
    (action: ServerAction) => {
      switch (action.action) {
        case "create-item":
          if (!action.payload.name) {
            break;
          }
          const id = crypto.randomUUID();
          changeList((doc) => {
            if (!doc.items) {
              doc.items = [] as unknown as AList<Item>;
            }
            doc.items.push({
              id,
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
              doc.items[index].name = action.payload.name;
              doc.items[index].completedAt = action.payload.completedAt;
            }
          });
          break;
        case "delete-completed":
          const indexesToDelete: number[] = [];
          changeList((doc) => {
            for (let index = 0; index < doc.items.length; index++) {
              if (doc.items[index].completedAt !== null) {
                indexesToDelete.push(index);
              }
            }
            for (const index of indexesToDelete.reverse()) {
              doc.items.deleteAt(index);
            }
          });
          break;
      }
    },
    [changeList],
  );

  function reducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
      case "list-updated": {
        return {
          ...state,
          lists: {
            ...state.lists,
            [action.payload.id]: action.payload,
          },
        };
      }
      case "item-updated": {
        return {
          ...state,
          items: {
            ...state.items,
            [action.payload.id]: action.payload,
          },
        };
      }
      case "item-deleted": {
        const filtered = Object.keys(state.items).reduce(
          (res: AppState["items"], key) => {
            if (key !== action.payload.id) {
              res[key] = state.items[key];
            }
            return res;
          },
          {},
        );
        return {
          ...state,
          items: filtered,
        };
      }
      case "ui/list-selected": {
        return {
          ...state,
          items: {},
          ui: {
            selectedListId: action.payload?.id,
          },
        };
      }
      default: {
        return state;
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch, selectedList, sendJsonMessage };
}

export const itemsSelector = (state: AppState) => Object.values(state.items);
export const listsSelector = (state: AppState) => Object.values(state.lists);
export const selectedListSelector = (state: AppState) => {
  if (state.ui.selectedListId) {
    return state.lists[state.ui.selectedListId];
  }
};
