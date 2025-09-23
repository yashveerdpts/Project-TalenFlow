import ReactDOM from "react-dom/client";
import './App.css';
import App from "./App";

import { JobsProvider } from "./context/JobsContext";
import { runSeed } from "./seedDB";

const {worker} = require('./api/handler');
async function main(){
  await worker.start({
    onUnhandledRequest: 'bypass'
  })
}
await runSeed();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <JobsProvider>
      <App />
    </JobsProvider>
  
);
main();