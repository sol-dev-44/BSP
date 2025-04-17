import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import RoutesIndex from "./RoutesIndex.tsx";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root") as any).render(
  <Provider store={store}>
    <RoutesIndex />
  </Provider>,
);
