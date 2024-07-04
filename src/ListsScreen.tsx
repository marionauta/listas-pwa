import { useCallback, useEffect } from "react";
import { Header, Heading } from "react-aria-components";
import { ReadyState } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { List } from "./models/List";

type Props = {
  lists: List[];
  setList: (list: List) => void;
  readyState: ReadyState;
  sendJsonMessage: SendJsonMessage;
};

export default function ListsScreen({
  lists,
  setList,
  readyState,
  sendJsonMessage,
}: Props) {
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    sendJsonMessage({ action: "get-lists" });
  }, [readyState]);

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
