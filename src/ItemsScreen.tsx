import { useCallback, useState } from "react";
import ItemList from "./ItemList";
import { Item } from "./models/Item";
import { Button, Input, Header } from "react-aria-components";
import { ServerAction } from "./AppState";
import { useLoaderData } from "react-router-dom";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import type { ItemList as ItemListType } from "./models/List";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { Doc } from "@automerge/automerge";

interface LoaderData {
  list: Doc<ItemListType> | undefined;
  listId: AnyDocumentId;
}

export function loader({ params }: any): LoaderData {
  const [list] = useDocument<ItemListType>(params.listId);
  return { list, listId: params.listId };
}

type Props = {
  closeList: () => void;
  sendJsonMessage: (action: ServerAction) => void;
};

export default function ItemsScreen({ closeList, sendJsonMessage }: Props) {
  const { list, listId } = useLoaderData() as LoaderData;

  const [value, setValue] = useState("");

  const createItem = useCallback(() => {
    const name = value;
    sendJsonMessage({ action: "create-item", payload: { listId, name } });
    setValue("");
  }, [sendJsonMessage, setValue, value]);

  const updateItem = useCallback(
    (item: Item) => {
      sendJsonMessage({ action: "update-item", payload: { listId, ...item } });
    },
    [sendJsonMessage],
  );

  const deleteCompleted = useCallback(() => {
    sendJsonMessage({ action: "delete-completed", payload: { listId } });
  }, [sendJsonMessage]);

  const toggleItem = useCallback(
    (item: Item) => () =>
      updateItem({
        ...item,
        completedAt:
          item.completedAt === null ? Math.floor(Date.now() / 1000) : null,
      }),
    [updateItem],
  );

  if (!list) {
    return <span>Retrieving list...</span>;
  }

  return (
    <>
      <Header className="toolbar">
        <Button onPress={closeList}>X</Button>
        <Input
          type="text"
          value={value}
          onKeyDown={(e) => e.key === "Enter" && createItem()}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onPress={createItem}>Add</Button>
        <Button onPress={deleteCompleted}>Delete completed</Button>
      </Header>
      <ItemList
        items={list.items}
        toggleItem={toggleItem}
        editItem={updateItem}
      />
    </>
  );
}
