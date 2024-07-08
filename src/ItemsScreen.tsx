import { FormEvent, useCallback } from "react";
import ItemList from "./ItemList";
import { Item } from "./models/Item";
import { Button, Input, Header, Form } from "react-aria-components";
import { Link, useLoaderData } from "react-router-dom";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import type { ItemList as ItemListType } from "./models/List";
import { DocumentId, isValidDocumentId } from "@automerge/automerge-repo";
import { List as AList } from "@automerge/automerge";

interface LoaderData {
  listId: DocumentId | undefined;
}

export function loader({ params }: any): LoaderData {
  const listId = params.listId;
  if (isValidDocumentId(listId)) {
    return { listId };
  }
  return { listId: undefined };
}

export type ServerAction = { action: string; payload?: any };

function useList(listId: DocumentId | undefined) {
  const [list, changeList] = useDocument<ItemListType>(listId);

  const dispatch = useCallback(
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

  return [list, dispatch] as const;
}

export default function ItemsScreen() {
  const { listId } = useLoaderData() as LoaderData;
  const [list, dispatch] = useList(listId);

  const onCreateItem = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const itemName = data.get("item-name");
      if (itemName && typeof itemName === "string") {
        dispatch({ action: "create-item", payload: { name: itemName } });
        form.reset();
        const inputs = form.getElementsByTagName("input");
        (inputs[0] as HTMLInputElement).focus();
      }
    },
    [dispatch],
  );

  const updateItem = useCallback(
    (item: Item) => {
      dispatch({ action: "update-item", payload: { listId, ...item } });
    },
    [dispatch],
  );

  const deleteCompleted = useCallback(() => {
    dispatch({ action: "delete-completed", payload: { listId } });
  }, [dispatch]);

  const toggleItem = useCallback(
    (item: Item) => () =>
      updateItem({
        ...item,
        completedAt:
          item.completedAt === null ? Math.floor(Date.now() / 1000) : null,
      }),
    [updateItem],
  );

  if (!listId) {
    return <span>Invalid document id</span>;
  }

  if (!list) {
    return <span>Retrieving list...</span>;
  }

  return (
    <>
      <Form onSubmit={onCreateItem}>
        <Header className="toolbar">
          <Link to="/">
            <span>X</span>
          </Link>
          <Input type="text" name="item-name" />
          <Button type="submit">Add</Button>
          <Button onPress={deleteCompleted}>Delete completed</Button>
        </Header>
      </Form>
      <ItemList
        items={list.items}
        toggleItem={toggleItem}
        editItem={updateItem}
      />
    </>
  );
}
