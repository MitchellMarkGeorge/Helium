import { Field, Input as HeadlessInput, Label } from "@headlessui/react";
import "./Input.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export default function Input({ label, id, ...inputProps }: Props) {
  const inputMarkup = (
    <HeadlessInput type="text" className="input" id={id} {...inputProps} />
  );
  const hasLabel = Boolean(label);
  return hasLabel ? (
    <Field className="input-field">
      <Label className="input-label text-xs" htmlFor={id}>
        {label}
      </Label>
      {inputMarkup}
    </Field>
  ) : (
    inputMarkup
  );
}
