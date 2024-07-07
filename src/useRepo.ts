import { Repo } from "@automerge/automerge-repo";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { useCallback, useState } from "react";
import { ItemList } from "./models/List";
import { List } from "@automerge/automerge";
import { Item } from "./models/Item";

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

  const createItemList = useCallback(
    (name: string) => {
      const handle = repo.create<ItemList>();
      handle.change((doc) => {
        doc.name = name;
        doc.items = [] as unknown as List<Item>;
      });
      return handle.documentId;
    },
    [repo],
  );

  return {
    repo,
    createItemList,
  };
}
