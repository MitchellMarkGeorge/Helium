import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import {
  MessageModalOptions,
  ModalButton,
  NotificationType,
  PrimaryModalButton,
} from "renderer/models/notification/types";
import ModalContainer from "../ModalContainer";
import {
  CheckCircleFill,
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import Button from "../../Button";
import "./MessageModal.scss";

interface Props {
  options: MessageModalOptions;
}

const MessageModal = ({ options }: Props) => {
  const workspace = useWorkspace();
  const closeModal = action(() => {
    workspace.notifications.closeModal();
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircleFill color="#16A34A" size="2.25rem"/>;
      case "error":
        return <XCircleFill color="#DC2626" size="2.25rem" />;
      case "info":
        return <InfoCircleFill color="#3B82F6" size="2.25rem" />;
      case "warning":
        return <ExclamationTriangleFill color="#D97706" size="2.25rem" />;
    }
  };

  const getButtons = (options: MessageModalOptions) => {
    // think about this
    // only watning message modals should show multiple buttons
    if (options.type === "warning" && Array.isArray(options.buttons)) {
      const [primaryButton, secondaryButton] = options.buttons as [
        PrimaryModalButton<void>,
        ModalButton
      ];
      return (
        <div className="message-modal-buttons">
          <Button
            variant="destructive"
            fullWidth
            onClick={action(() => {
              primaryButton.onClick();
              closeModal();
            })}
          >
            {primaryButton.text}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={action(() => {
              secondaryButton.onClick();
              closeModal();
            })}
          >
            {secondaryButton.text}
          </Button>
        </div>
      );
    } else {
      const modalButton = options.buttons as ModalButton;
      return (
        <Button variant="secondary" fullWidth onClick={closeModal}>
          {modalButton.text}
        </Button>
      );
    }
  };

  return (
    <Dialog open={workspace.notifications.isModalOpen} onClose={closeModal} className="modal">
      <ModalContainer>
        <DialogPanel className="message-modal">
          {getIcon(options.type)}
          <DialogTitle as="div" className="message-modal-message text-xs">
            {options.message}
          </DialogTitle>
          {getButtons(options)}
        </DialogPanel>
      </ModalContainer>
    </Dialog>
  );
};

export default observer(MessageModal);
