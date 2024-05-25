import { HeliumId } from "common/types";

export interface ModalState {
  isOpen: boolean;
  options: ModalOptions | null;
}
// think of better name
export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationOptions {
  type: NotificationType;
  message: string;
}

export interface Notification extends NotificationOptions {
  id: HeliumId;
}

export interface LoadingNotificationOptions {
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
}

// all modals have a primary text and secondary text
export interface ModalOptions {
  // primary button will be optional for some options
  modalType: "message" | "input";
}
export interface MessageModalOptions extends ModalOptions {
  modalType: "message";
  type: NotificationType;
  message: string;
  buttons: [PrimaryModalButton, ModalButton] | ModalButton;
}

export interface ModalButton {
    text: string
}

type CancelModalButton = ModalButton;

export interface PrimaryModalButton extends ModalButton {
  onClick: (inputs?: Record<string, string>) => void;
}



export interface InputModalOptions extends ModalOptions {
  modalType: "input";
  title: string;
  isPathInputModal: boolean;
  // description: string;
  inputFields: InputModalField[];
  // first button is used for cancel
  buttons: [CancelModalButton, PrimaryModalButton];
}

export interface InputModalField {
  label: string;
  placeholder: string;
}

export interface PathInputModalOptions extends InputModalOptions {
  isPathInputModal: true;
  inputFields: PathInputField[];
}

export interface PathInputField extends InputModalField {
  parentPath: string | null;
  // if the input if for a directory or
  for: 'directory' | 'file';

}

