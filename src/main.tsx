import ReactDOM from "react-dom/client";
import App from "./App";
import Settings from "./Settings";

const isSettings = window.location.hash.includes("settings");

ReactDOM.createRoot(document.getElementById("root")!).render(
  isSettings ? <Settings /> : <App />
);