import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Repo } from "@automerge/automerge-repo"; // inits automerge wasm
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import App from "./App";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter(),
});

root.render(
  <StrictMode>
    <Suspense>
      <RepoContext.Provider value={repo}>
        <App />
      </RepoContext.Provider>
    </Suspense>
  </StrictMode>,
);
