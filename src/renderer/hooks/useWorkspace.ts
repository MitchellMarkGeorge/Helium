import { useContext } from "react";
import { WorkspaceContext } from "renderer/contexts/Workspace";

export const useWorkspace = () => {
    const workspace = useContext(WorkspaceContext);

    if (!workspace) {
        throw new Error("useWorkspace must be used within WorkSpaceContext.Provider");
    }
    
    return workspace;
}