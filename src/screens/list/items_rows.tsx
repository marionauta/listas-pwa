import { Button, DialogTrigger } from "react-aria-components";
import ItemEditor from "./item_editor";
import type { Item, ItemId, ItemChangePayload } from "../../models/Item";

type Props = {
  items: Item[] | undefined;
  toggleItem: (item: Item) => () => void;
  editItem: (item: ItemChangePayload) => void;
  deleteItem: (id: ItemId) => void;
};

export default function ItemsRows({
  items,
  toggleItem,
  editItem,
  deleteItem,
}: Props) {
  if (items === undefined || items.length === 0) {
    return <EmptyItems placeholder="Nothing here." />;
  }
  return (
    <div className="list-container">
      <div className="list-content">
        {items.map((item) => (
          <label key={item.id} className="row" htmlFor={item.id}>
            <input
              id={item.id}
              type="checkbox"
              checked={item.completedAt !== null}
              onChange={toggleItem(item)}
            />
            <span className="principal">{item.name}</span>
            <DialogTrigger>
              <Button>⌘</Button>
              <ItemEditor
                item={item}
                editItem={editItem}
                deleteItem={deleteItem}
              />
            </DialogTrigger>
          </label>
        ))}
      </div>
    </div>
  );
}

export function EmptyItems({ placeholder }: { placeholder: string }) {
  return (
    <div className="list-container-empty">
      <span>{placeholder}</span>
    </div>
  );
}
