type Props = {
  items: any[];
  toggleItem: (item: any) => () => void;
  editItem: (item: any) => () => void;
}

const ItemList = ({ items, toggleItem, editItem }: Props) =>
  <>
    {items.map((item) => (
      <div key={item.id} className="item-row">
        <input
          id={item.id}
          type="checkbox"
          checked={item.completed_at !== null}
          onChange={toggleItem(item)}
        />
        <label htmlFor={item.id}>{item.name}</label>
        <button onClick={editItem(item)}>:</button>
      </div>
    ))}
  </>

export default ItemList;
