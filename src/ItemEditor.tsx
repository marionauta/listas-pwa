import { useCallback } from "react";
import { useState } from "react";
import { Item } from "./models/Item";

type Props = {
  item: Item;
  saveItem: (item: Item) => void;
  close: () => void;
}

const ItemEditor = ({ item, saveItem, close }: Props) => {
  const [name, setName] = useState(item.name);

  const onChangeName = useCallback((event: any) => {
    setName(event.target.value)
  }, [setName])
  const onSaveItem = useCallback(() => {
    if (item === undefined || name === undefined) return
    const updated = {
      ...item,
      name,
    }
    saveItem(updated);
    close()
  }, [name])

  return (
    <div className="backdrop">
      <div className="modal">
        <h3>Rename item</h3>
        <input type="text" value={name} onChange={onChangeName} />
        <button onClick={onSaveItem}>Change</button>
        <br />
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  );
};

export default ItemEditor;
