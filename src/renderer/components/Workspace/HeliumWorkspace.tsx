import { observer } from "mobx-react-lite"
import SplashLogo from "../../assets/SplashLogo.svg"
import "./HeliumWorkspace.scss";

function HeliumWorkspace() {
  return (
    <div className="workspace">
      <SplashLogo height="150px" width="150px"/>
    </div>
  )
}

export default observer(HeliumWorkspace);

