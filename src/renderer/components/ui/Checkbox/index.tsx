import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check2 } from "react-bootstrap-icons"
import "./Checkbox.scss";
import classNames from "classnames";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={classNames('checkbox', className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className="checkbox-indicator"
    >
      <Check2 className="checkbox-icon" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

export default Checkbox;
