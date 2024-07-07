import { Button, DialogTrigger } from "react-aria-components";
import ItemEditor from "./ItemEditor";
import { Item } from "./models/Item";

type Props = {
  items: Item[] | undefined;
  toggleItem: (item: any) => () => void;
  editItem: (item: any) => () => void;
};

const ItemList = ({ items, toggleItem, editItem }: Props) => {
  if (items === undefined || items.length === 0) {
    return null;
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
            {/* <button onClick={editItem(item)}>⌘</button> */}
            <DialogTrigger>
              <Button>⌘</Button>
              <ItemEditor item={item} saveItem={editItem} />
            </DialogTrigger>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
