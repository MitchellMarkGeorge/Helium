import { useEffect, useState } from "react";
import "./index.css";

import { createRoot } from "react-dom/client";

const container = document.getElementById("app") as HTMLElement;
const root = createRoot(container);

const Test = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {

    window.helium.app.onceInitalStateReady((initalState) => {
      console.log(initalState);
      setShowLoading(false);
    });

    window.helium.app.notifyUiReady();
  }, []);

  if (showLoading) {
    return <div>Loading...</div>;
  } else {
    return <div>Done Loading!!!</div>;
  }
};

root.render(<Test />);
