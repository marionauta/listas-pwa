import { FormEvent, useCallback } from "react";
import type { DocumentId } from "@automerge/automerge-repo/slim";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { Button, Input, Form } from "react-aria-components";
import { Link, useLoaderData } from "react-router-dom";
import { ulid } from "ulid";
import ItemsRows, { EmptyItems } from "./ItemsRows";
import type { Item } from "./models/Item";
import type { ItemList as ItemListType } from "./models/List";
import type { LoaderData } from "./itemsScreenLoader";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        case "delete-completed":
          changeList((doc) => {
            const indexesToDelete: number[] = [];
            for (let index = 0; index < doc.items.length; index++) {
              if (doc.items[index].completedAt !== null) {
                indexesToDelete.push(index);
              }
            }
            for (const index of indexesToDelete.reverse()) {
              doc.items.splice(index, 1);
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
    (item: Partial<Item>) => {
      dispatch({ action: "update-item", payload: item });
    },
    [dispatch],
  );

  const deleteCompleted = useCallback(() => {
    dispatch({ action: "delete-completed" });
  }, [dispatch]);

  const toggleItem = useCallback(
    (item: Pick<Item, "id" | "completedAt">) => () =>
      updateItem({
        id: item.id,
        completedAt: item.completedAt === null ? new Date() : null,
      }),
    [updateItem],
  );

  const isFormDisabled = !listId || !list;

  return (
    <>
      <Form className="toolbar" onSubmit={onCreateItem}>
        <Link to="/" className="button">
          X
        </Link>
        <Input type="text" name="item-name" required />
        <Button type="submit" isDisabled={isFormDisabled}>
          Add
        </Button>
        <Button onPress={deleteCompleted} isDisabled={isFormDisabled}>
          Delete completed
        </Button>
      </Form>
      {!listId ? (
        <EmptyItems placeholder="Invalid list ID." />
      ) : !list ? (
        <EmptyItems placeholder="Retrieving list..." />
      ) : (
        <ItemsRows
          items={list.items}
          toggleItem={toggleItem}
          editItem={updateItem}
        />
      )}
    </>
  );
}
