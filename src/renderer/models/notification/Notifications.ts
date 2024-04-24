import { Model } from "../Model";
import { Workspace } from "../workspace/Workspace";
import {
  NotificationOptions,
  LoadingNotificationOptions,
  ModalOptions,
  MessageModalOptions,
  InputModalOptions,
} from "./types";

export class Notifications extends Model {
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

  //   public openModal() {
  //     if (!this.modalOptions) throw new Error("No modal options provided");
  //     this.modalOpen = true;
  //   }

  public closeModal() {
    this.modalOpen = false;
    if (this.modalOptions) {
      this.modalOptions = null;
    }
  }
  // should i use radix-ui toasts or react-hot-toasts
  // react-hot-toast has a lot of customization options and is easier to work with
  // advantage of radix is that if I use radix-ui for the modal they might not collide (from same libraray)
  public showNotification(options: NotificationOptions) {}
  public showLoadingNotification(options: LoadingNotificationOptions) {}
  // need to find a way to get thier results
  private showModal<T>(options: ModalOptions<T>) {
    if (this.modalOpen || this.modalOptions) {
      throw new Error("Modal already open");
    }
    this.modalOpen = true;
    this.modalOptions = options;
  }
  public showMessageModal(options: MessageModalOptions) {
    this.showModal(options);
  }
  public showInputModal(options: InputModalOptions) {
    this.showModal(options);
  }
}
