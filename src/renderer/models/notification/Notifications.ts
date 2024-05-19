import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import {
  NotificationOptions,
  LoadingNotificationOptions,
  ModalOptions,
  MessageModalOptions,
  InputModalOptions,
  PathInputModalOptions,
} from "./types";

export class Notifications extends StateModel {
  private modalOpen: boolean;
  private modalOptions: ModalOptions | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.modalOpen = false;
    this.modalOptions = null;
  }

  public get isModalOpen() {
    return this.modalOpen;
  }


  // should i use radix-ui toasts or react-hot-toasts
  // react-hot-toast has a lot of customization options and is easier to work with
  // advantage of radix is that if I use radix-ui for the modal they might not collide (from same libraray)
  public showNotification(options: NotificationOptions) {}
  public showLoadingNotification(options: LoadingNotificationOptions) {}
  // need to find a way to get thier results
  private openModal<T extends ModalOptions>(options: T) {
    if (this.modalOpen || this.modalOptions) {
      throw new Error("Modal already open");
    }
    this.modalOpen = true;
    this.modalOptions = options;
  }

  public closeModal() {
    this.modalOpen = false;
    if (this.modalOptions) {
      this.modalOptions = null;
    }
  }
  public showMessageModal(options: Omit<MessageModalOptions, 'modalType'>) {
    this.openModal({ modalType: 'message', ...options});
  }

  public showInputModal(options: Omit<InputModalOptions, 'modalType'>) {
    this.openModal({ modalType: 'input', ...options});
  }

  public showPathInputModal(options: Omit<PathInputModalOptions, 'modalType' | 'isPathInputModal'>) {
    this.openModal({ modalType: 'input', isPathInputModal: true ...options});
  }
}
