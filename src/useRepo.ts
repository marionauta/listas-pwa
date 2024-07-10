import { Repo } from "@automerge/automerge-repo"; // inits Automerge
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { useState } from "react";

export function useRepo() {
  const [repo] = useState(() => {
    return new Repo({
      network: [
        new BroadcastChannelNetworkAdapter(),
        new BrowserWebSocketClientAdapter("wss://sync.automerge.org"),
      ],
      storage: new IndexedDBStorageAdapter(),
    });
  });

  return {
    repo,
  };
}
