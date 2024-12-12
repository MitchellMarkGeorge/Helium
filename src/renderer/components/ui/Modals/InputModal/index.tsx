import { Dialog, DialogPanel, DialogTitle, Fieldset } from "@headlessui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import { InputModalOptions } from "renderer/models/notification/types";
import ModalContainer from "../ModalContainer";
import Input from "../../Input";
import Button from "../../Button";
import "./InputModal.scss";

interface Props<T = Record<string, string>> {
  options: InputModalOptions<T>;
}

function InputModal<T extends Record<string, string>>({ options }: Props<T>) {
  const workspace = useWorkspace();
  const [inputFieldStates, updateInputFieldStates] = useState(() =>
    options.inputFields.map(({ key, label, placeholder, type = "text" }) => ({
      inputName: key,
      label,
      type,
      placeholder,
      value: "",
    }))
  );
  const closeModal = action(() => {
    workspace.notifications.closeModal();
  });

  const [modalButton, primaryButton] = options.buttons;

  const secondaryButtonClick = action(() => {
    modalButton.onClick();
    workspace.notifications.closeModal();
  });

  return (
    <Dialog
      open={workspace.notifications.isModalOpen}
      onClose={closeModal}
      className="modal"
    >
      <ModalContainer>
        <DialogPanel className="input-modal">
          <DialogTitle as="div" className="input-modal-title">
            {options.title}
          </DialogTitle>
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const values = Object.fromEntries(formData);
              primaryButton.onClick(values as T);
              closeModal();
            }}
            className="input-modal-form"
          >
            {inputFieldStates.map((input, index) => (
              <Input
                onChange={(e) => {
                  let inputFieldsCopy = [...inputFieldStates];
                  inputFieldsCopy[index].value = e.target.value;
                  updateInputFieldStates(inputFieldsCopy);
                }}
                type={input.type}
                placeholder={input.placeholder}
                key={input.inputName}
                label={input.label}
                value={input.value}
                id={input.inputName}
                name={input.inputName}
                required
              />
            ))}
            <div className="input-modal-buttons">
              <Button variant="secondary" onClick={secondaryButtonClick}>
                {modalButton.text}
              </Button>
              <Button variant="primary" type="submit">
                {primaryButton.text}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </ModalContainer>
    </Dialog>
  );
}

export default observer(InputModal);
