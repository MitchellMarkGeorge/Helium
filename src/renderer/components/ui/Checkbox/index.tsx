import React from 'react'
import { Checkbox as HeadlessCheckbox } from "@headlessui/react";
import { Check2 } from "react-bootstrap-icons"
import classNames from "classnames";
import "./Checkbox.scss";

// confimr this
const Checkbox = React.forwardRef<
  React.ElementRef<typeof HeadlessCheckbox>,
  React.ComponentPropsWithoutRef<typeof HeadlessCheckbox>
>(({ className, ...props }, ref) => (
  <HeadlessCheckbox {...props} className={classNames('checkbox', className)} ref={ref}>
    <Check2 className="checkbox-icon"/>
  </HeadlessCheckbox>
))

export default Checkbox;
