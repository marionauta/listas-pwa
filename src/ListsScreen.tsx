import { useEffect } from "react";
import { ReadyState } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { List } from "./models/List";

type Props = {
  lists: List[];
  setList: (list: List) => void;
  readyState: ReadyState;
  sendJsonMessage: SendJsonMessage;
}

export default function ListsScreen({ lists, setList, readyState, sendJsonMessage }: Props) {
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) { return; }
    sendJsonMessage({ action: "get-lists" });
  }, [readyState, sendJsonMessage]);

  return (
    <>
      {lists.map(list =>
        <div className="list-row" key={list.id} onClick={() => setList(list)}>{list.name}</div>
      )}
    </>
  );
}
