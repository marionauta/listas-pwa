import { useCallback } from "react";
import { Header, Heading } from "react-aria-components";
import { List } from "./models/List";
import { ServerAction } from "./AppState";

type Props = {
  lists: List[];
  setList: (list: List) => void;
  sendJsonMessage: (action: ServerAction) => void;
};

export default function ListsScreen({
  lists,
  setList,
  sendJsonMessage,
}: Props) {
  const onListPress = useCallback(
    (list: List) => () => {
      setList(list);
    },
    [setList],
  );

  return (
    <>
      <Header className="toolbar">
        <Heading level={1}>Lists</Heading>
      </Header>
      {lists.map((list) => (
        <div className="row" key={list.id} onClick={onListPress(list)}>
          {list.name}
        </div>
      ))}
    </>
  );
}
