import { HeliumId, Language, StoreInfo } from "common/types";
import type { HTMLInputTypeAttribute } from "react";

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
  modalType: "message" | "input" | "pathInput";
}
export interface MessageModalOptions extends ModalOptions {
  modalType: "message";
  type: NotificationType;
  message: string;
  buttons: [PrimaryModalButton, ModalButton] | ModalButton;
  // can be canceld by closeing the modal via the "X" button or the cancel button
}

export interface ModalButton {
    text: string;
    onClick: () => void;
}


export interface PrimaryModalButton<T = Record<string, string>> {
  text: string;
  onClick: (inputs: T) => void;
}



export interface InputModalOptions<T> extends ModalOptions {
  modalType: "input";
  title: string;
  // description: string;
  // inputFields: InputModalField[];
  // the string is the fieldName
  // might still need an array so thay can stay in order...
  // inputFields: Record<string, InputModalField>;
  inputFields: InputModalField[];
  // first button is generally used for cancel
  buttons: [ModalButton, PrimaryModalButton<T>];
  onCloseButtonClick: () => void;
}

export interface InputModalField {
  label: string;
  key: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  placeholder: string;
}

export interface PathInputModalOptions<T> extends ModalOptions {
  modalType: "pathInput"
  title: string;
  // the string is the fieldName
  inputFields:  PathInputField[]
  // first button is used for cancel
  buttons: [ModalButton, PrimaryModalButton<T>];
  onCloseButtonClick: () => void;
}

export interface PathInputField extends InputModalField {
  parentPath: string | null;
  // if the input if for a directory or
  for: 'directory' | 'file';

}

export interface ModalResponse<T = void> {
  // use a boolean instead???
  buttonClicked: "primary" | "secondary" | "close";
  data: T | null;
}

export interface InputResult {
  value: string;
}

export interface FilePathInputResult {
  fileName: string;
  fileType: Language; // or FileType 
  filePath: string
}

export interface FolderPathInputResult {
  folderName: string
  folderPath: string
}

