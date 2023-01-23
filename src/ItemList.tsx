type Props = {
  items: any[];
  toggleItem: (item: any) => () => void;
  editItem: (item: any) => () => void;
}

const ItemList = ({ items, toggleItem, editItem }: Props) => {
  if (items.length === 0) {
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
              checked={item.completed_at !== null}
              onChange={toggleItem(item)}
            />
            <span className="principal">{item.name}</span>
            <button onClick={editItem(item)}>⌘</button>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
