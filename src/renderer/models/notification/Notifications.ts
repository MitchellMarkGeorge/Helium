import { enqueueSnackbar } from "notistack";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import {
  NotificationOptions,
  ModalOptions,
  MessageModalOptions,
  InputModalOptions,
  PathInputModalOptions,
  ModalState,
} from "./types";

export class Notifications extends StateModel {
  private modalState: ModalState;
  constructor(workspace: Workspace) {
    super(workspace);
    this.modalState = {
      isOpen: false,
      options: null, 
    };
  }

  public get isModalOpen() {
    return this.modalState.isOpen;
  }

  public showNotification(options: NotificationOptions) {
    enqueueSnackbar({
      message: options.message,
      key: window.helium.utils.generateHeliumId(),
      variant: options.type,
    });
  }

  private openModal<T extends ModalOptions>(options: T) {
    if (this.isModalOpen) {
      throw new Error("Modal already open");
    }
    this.modalState = {
      isOpen: true,
      options,
    }
  }

  public closeModal() {
    this.modalState = {
      isOpen: false,
      options: null,
    }
  }

  public showMessageModal(options: Omit<MessageModalOptions, 'modalType'>) {
      this.openModal({ modalType: 'message', ...options});
      // can use return when(() => this.modalOpen === false);
  }

  public showInputModal(options: Omit<InputModalOptions, 'modalType'>) {
      this.openModal({ modalType: 'input', ...options});
  }

  public showPathInputModal(options: Omit<PathInputModalOptions, 'modalType' | 'isPathInputModal'>) {
      this.openModal({ modalType: 'input', isPathInputModal: true, ...options});
  }
  public cleanup() {
    // no-op
      return;
  }
}
