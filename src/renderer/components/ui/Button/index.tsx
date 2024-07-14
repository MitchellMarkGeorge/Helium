import { VariantProps, cva } from "class-variance-authority";
import { PropsWithChildren, forwardRef } from "react";
import { Button as HeadlessButton } from "@headlessui/react";

import "./Button.scss";
import classNames from "classnames";

type ButtonVariantType = "primary" | "secondary" | "destructive";

const buttonVariants = cva("button", {
  variants: {
    variant: {
      primary: "button-primary",
      secondary: "button-secondary",
      destructive: "button-destructive",
      disabled: "button-disabled",
    },
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
  variant?: ButtonVariantType;
  //   disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", fullWidth = false, disabled, ...props },
    ref
  ) => {
    const buttonClasses = classNames(
      buttonVariants({ variant: disabled ? "disabled" : variant, className }),
      "text-xs",
      {
        "full-width": fullWidth,
      }
    );
    return <HeadlessButton className={buttonClasses} ref={ref} {...props} />;
  }
);

export default Button;
