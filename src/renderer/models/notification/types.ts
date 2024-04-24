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
export interface ModalOptions<T> {
  // primary button will be optional for some options
  modalType: "message" | "input";
  primaryButtonText: string;
  onPrimaryButtonClick: (args: T) => void;
  secondaryButtonText: string;
}
export interface MessageModalOptions extends ModalOptions<void> {
  modalType: "message";
  type: NotificationType;
  message: string;
}

export interface InputModalOptions
  extends ModalOptions<Record<string, string>> {
  modalType: "input";
  title: string;
  // description: string;
  inputFields: InputModalFields[];
}

export interface InputModalFields {
  label: string;
  placeholder: string;
}
