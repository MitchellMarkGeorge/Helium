import { useCallback, useEffect, useState } from "react";
import "./index.css";

import { createRoot } from "react-dom/client";

const container = document.getElementById("app") as HTMLElement;
const root = createRoot(container);

const Test = () => {
  const [showLoading, setShowLoading] = useState(true);
//   const [readyToShowWorkspace, setShowLoading] = useState(true);
  const [showError, setShowError] = useState(false);

  const loadInitalState = useCallback(async () => {
    try {
        const initalState = await window.helium.app.loadInitalState();
        // const initalState = await window.helium.app.whenReadyToShowWorkspace();
        console.log(initalState);
        // workspace.init(initalState)
        setShowLoading(false);
    } catch (error) {
       setShowError(true); 
    }
  }, [])

  useEffect(() => {
    loadInitalState()
  }, [loadInitalState]);

  if (showLoading) {
    return <div>Loading...</div>;
  } else {
    return <div>Done Loading!!!</div>;
  }
};

root.render(<Test />);
