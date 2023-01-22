import { useReducer } from "react";
import { Item } from "./models/Item";
import { List } from "./models/List";

interface UIState {
  selectedListId: List["id"] | undefined;
}

export interface AppState {
  lists: Record<List['id'], List>;
  items: Record<Item['id'], Item>;
  ui: UIState;
}

const initialState: AppState = {
  lists: {},
  items: {},
  ui: {
    selectedListId: undefined
  }
}

export type AppAction = { type: string; payload: any }

export function useAppState() {
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
        const filtered = Object.keys(state.items).reduce((res: AppState['items'], key) => {
          if (key !== action.payload.id) {
            res[key] = state.items[key];
          }
          return res;
        }, {});
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
  return useReducer(reducer, initialState);
}

export const itemsSelector = (state: AppState) => Object.values(state.items);
export const listsSelector = (state: AppState) => Object.values(state.lists);
export const selectedListSelector = (state: AppState) => {
  if (state.ui.selectedListId) {
    return state.lists[state.ui.selectedListId]
  }
}
