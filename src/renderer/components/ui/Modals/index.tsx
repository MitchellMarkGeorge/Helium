import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import {
  InputModalOptions,
  MessageModalOptions,
  ModalOptions,
  ModalState,
  PathInputModalOptions,
} from "renderer/models/notification/types";
import "./Modal.scss";
import MessageModal from "./MessageModal";
import { toJS } from "mobx";

const Modals = () => {
  const isMessageModal = (
    modalOptions: ModalOptions
  ): modalOptions is MessageModalOptions => {
    return modalOptions.modalType === "message";
  };

  const isInputModal = <T,>(
    modalOptions: ModalOptions
  ): modalOptions is InputModalOptions<T> => {
    return modalOptions.modalType === "input";
  };

  const isPathInputModal = <T,>(
    modalOptions: ModalOptions
  ): modalOptions is PathInputModalOptions<T> => {
    return modalOptions.modalType === "pathInput";
  };

  const getModal = ({ isOpen, options }: ModalState) => {
    if (!isOpen || !options) {
      return null;
    } else if (isMessageModal(options)) {
      console.log(toJS(options));
      return <MessageModal options={options} />;
    } else if (isInputModal(options)) {
      return null;
    } else if (isPathInputModal(options)) {
      return null;
    }
  };
  const workspace = useWorkspace();

  return getModal(workspace.notifications.getModalState());
};

export default observer(Modals);
