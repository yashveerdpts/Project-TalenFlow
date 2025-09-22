import ReactDOM from "react-dom/client";
import './App.css';
import App from "./App";
import { makeServer } from "./api/server";
import { JobsProvider } from "./context/JobsContext";

if (process.env.NODE_ENV === "development") {
  makeServer();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <JobsProvider>
      <App />
    </JobsProvider>
  
);