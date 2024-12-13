import React from "react";
import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";
import { Check2 } from "react-bootstrap-icons";
import classNames from "classnames";
import "./Checkbox.scss";

interface Props
  extends React.ComponentPropsWithoutRef<typeof HeadlessCheckbox> {
  label?: string;
}

// confimr this
const Checkbox = React.forwardRef<
  React.ElementRef<typeof HeadlessCheckbox>,
  Props
>(({ className, label, id, checked, disabled, ...props }, ref) => {
  console.log(checked);
  const checkBoxMarkup = (
    <HeadlessCheckbox
      checked={checked}
      disabled={disabled}
      {...props}
      className={classNames("checkbox", className)}
      ref={ref}
    >
      {checked ? <Check2 className="checkbox-icon" /> : null}
    </HeadlessCheckbox>
  );

  if (label) {
    return (
      <Field className="checkbox-container" disabled={disabled}>
        {checkBoxMarkup}
        <Label className="text-xs checkbox-label">
          {label}
        </Label>
      </Field>
    );
  }

  return checkBoxMarkup;
});

export default Checkbox;
