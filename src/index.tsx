import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!!);

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/worker.js');
// }

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
