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
  ModalResponse,
} from "./types";
import { action, computed, observable } from "mobx";

type ShowMessageModalOptions = Pick<MessageModalOptions, "type" | "message"> & {
  primaryButtonText?: string;
  secondaryButtonText: string;
};

type ShowInputModalOptions<T> = Pick<
  InputModalOptions<T>,
  "title" | "inputFields"
> & {
  primaryButtonText: string;
  secondaryButtonText: string;
};

type ShowPathInputModalOptions<T> = Pick<
  PathInputModalOptions<T>,
  "title" | "inputFields"
> & {
  primaryButtonText: string;
  secondaryButtonText: string;
};

export class Notifications extends StateModel {
  @observable private accessor modalState: ModalState;
  constructor(workspace: Workspace) {
    super(workspace);
    this.modalState = {
      isOpen: false,
      options: null,
    };
  }

  @computed
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

  @action
  private openModal<T extends ModalOptions>(options: T) {
    if (!this.isModalOpen) {
      this.modalState = {
        isOpen: true,
        options,
      };
    }
  }

  @action
  public closeModal() {
    this.modalState = {
      isOpen: false,
      options: null,
    };
  }

  @action
  public showMessageModal(
    options: ShowMessageModalOptions
  ): Promise<ModalResponse> {
    return new Promise((resolve) => {
      this.openModal<MessageModalOptions>({
        modalType: "message",
        type: options.type,
        message: options.message,
        buttons: options.primaryButtonText
          ? [
              {
                text: options.primaryButtonText,
                onClick: () =>
                  resolve({ buttonClicked: "primary", result: null }),
              },
              {
                text: options.secondaryButtonText,
                onClick: () =>
                  resolve({ buttonClicked: "secondary", result: null }),
              },
            ]
          : {
              text: options.secondaryButtonText,

              onClick: () =>
                resolve({ buttonClicked: "secondary", result: null }),
            },
      });
    });
  }

  @action
  public showInputModal<T>(
    options: ShowInputModalOptions<T>
  ): Promise<ModalResponse<T>> {
    return new Promise((resolve) => {
      this.openModal<InputModalOptions<T>>({
        modalType: "input",
        title: options.title,
        inputFields: options.inputFields,
        onCloseButtonClick: () =>
          resolve({ buttonClicked: "close", result: null }),
        buttons: [
          {
            text: options.secondaryButtonText,
            onClick: () =>
              resolve({ buttonClicked: "secondary", result: null }),
          },
          {
            text: options.primaryButtonText,
            onClick: (result) => resolve({ buttonClicked: "primary", result }),
          },
        ],
      });
    });
  }

  @action
  public showPathInputModal<T>(
    options: ShowPathInputModalOptions<T>
  ): Promise<ModalResponse<T>> {
    return new Promise((resolve) => {
      this.openModal<PathInputModalOptions<T>>({
        modalType: "pathInput",
        title: options.title,
        inputFields: options.inputFields,
        onCloseButtonClick: () =>
          resolve({ buttonClicked: "close", result: null }),
        buttons: [
          {
            text: options.secondaryButtonText,
            onClick: () =>
              resolve({ buttonClicked: "secondary", result: null }),
          },
          {
            text: options.primaryButtonText,
            onClick: (result) => resolve({ buttonClicked: "primary", result }),
          },
        ],
      });
    });
  }

  @action
  public reset() {
    // no-op
    return;
  }
}
