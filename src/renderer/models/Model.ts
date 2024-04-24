import { Workspace } from "./workspace/Workspace";

export abstract class Model {
    constructor(protected workspace: Workspace) {};
}