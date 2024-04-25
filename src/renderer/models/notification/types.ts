import { intercept } from "mobx";

// think of better name
export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationOptions {
  type: NotificationType;
  message: string;
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

export interface PrimaryModalButton extends ModalButton {
  onClick: (inputs?: Record<string, string>) => void;
}



export interface InputModalOptions extends ModalOptions {
  modalType: "input";
  title: string;
  // description: string;
  inputFields: InputModalFields[];
  buttons: [PrimaryModalButton, ModalButton];
}

export interface InputModalFields {
  label: string;
  placeholder: string;
}
