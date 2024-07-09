import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { RepoComponent } from "./RepoComponent";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RepoComponent>
      <App />
    </RepoComponent>
  </StrictMode>,
);
