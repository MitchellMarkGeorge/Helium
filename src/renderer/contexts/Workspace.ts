import { createContext, useContext } from "react";
import type { Workspace } from "../models/workspace/Workspace";

export const WorkspaceContext = createContext<Workspace | null>(null);