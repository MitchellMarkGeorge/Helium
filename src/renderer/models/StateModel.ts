import { Workspace } from "./workspace/Workspace";

export abstract class StateModel {
  constructor(protected workspace: Workspace) {}
  public abstract cleanup(): void;
}
