import { useCallback, useEffect, useState } from "react";
import { ReadyState } from "react-use-websocket";
import ItemEditor from "./ItemEditor";
import ItemList from "./ItemList";
import { Item } from "./models/Item";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type Props = {
  items: Item[];
  listId: string;
  closeList: () => void;
  sendJsonMessage: SendJsonMessage;
  readyState: ReadyState;
}

export default function ItemsScreen({ items, listId, closeList, sendJsonMessage, readyState }: Props) {
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) { return; }
    sendJsonMessage({ action: "get-items", payload: { listId } });
  }, [readyState, listId, sendJsonMessage]);

  const [value, setValue] = useState("");
  const [itemToEdit, setItemToEdit] = useState<Item | undefined>(undefined)

  const createItem = useCallback(() => {
    const name = value;
    sendJsonMessage({ action: "create-item", payload: { listId, name } });
    setValue("");
  }, [sendJsonMessage, setValue, value]);

  const updateItem = useCallback((item: Item) => {
    sendJsonMessage({ action: "update-item", payload: { listId, ...item } });
  }, [sendJsonMessage]);

  const deleteCompleted = useCallback(() => {
    sendJsonMessage({ action: "delete-completed", payload: { listId } });
  }, [sendJsonMessage]);

  const toggleItem = useCallback(
    (item: Item) => () => updateItem({
      ...item,
      completed_at:
        item.completed_at === null ? Math.floor(Date.now() / 1000) : null
    }),
    [updateItem],
  );

  const editItem = useCallback((item: Item | undefined) => () => {
    setItemToEdit(item)
  }, [setItemToEdit]);

  return (
    <>
      <div className="toolbar">
        <button onClick={closeList}>X</button>
        <input value={value} onKeyDown={e => e.key === "Enter" && createItem()} onChange={(e) => setValue(e.target.value)} />
        <button onClick={createItem}>Add</button>
        <button onClick={deleteCompleted}>Delete completed</button>
      </div>
      <ItemList items={items} toggleItem={toggleItem} editItem={editItem} />
      {itemToEdit && <ItemEditor item={itemToEdit} saveItem={updateItem} close={editItem(undefined)} />}
    </>
  );
}
