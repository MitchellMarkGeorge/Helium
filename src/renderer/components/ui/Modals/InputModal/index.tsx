import { useState } from "react";
import { InputModalOptions } from "renderer/models/notification/types";

interface Props<T> {
  options: InputModalOptions<T>;
}

const InputModal = <T,>(props: Props<T>) => {
  const [inputFieldStates, updateInputFieldStates] = useState(() =>
    Object.entries(props.options.inputFields).map(([inputName]) => ({
      inputName,
      value: "",
    }))
  );

  

  
};
