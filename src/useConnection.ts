import { useCallback, useEffect, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

type Options = {
  onMessage: (event: MessageEvent) => void;
};

export function useConnection({ onMessage }: Options) {
  const [url, setUrl] = useState("ws://localhost:8000/ws");
  const { sendJsonMessage, readyState } = useWebSocket(url, {
    onMessage,
  });

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    const interval = setInterval(() => {
      sendJsonMessage({ action: "ping" });
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [readyState]);

  const tryReconnect = useCallback(() => {
    console.warn("TODO: actually handle reconnect");
    setUrl("");
    setUrl("ws://localhost:8000/ws");
  }, []);

  return {
    readyState,
    sendJsonMessage,
    tryReconnect,
  };
}
