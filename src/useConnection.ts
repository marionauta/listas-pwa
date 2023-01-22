import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

type Options = {
  onMessage: (event: MessageEvent) => void;
}

export function useConnection({ onMessage }: Options) {
  const { sendJsonMessage, readyState } = useWebSocket("ws://localhost:8000/ws", { onMessage });

  return {
    readyState,
    sendJsonMessage,
  }
}
