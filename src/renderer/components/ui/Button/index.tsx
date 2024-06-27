import { VariantProps, cva } from "class-variance-authority";
import { PropsWithChildren, forwardRef } from "react";

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

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
  variant?: ButtonVariantType;
  //   disabled?: boolean;
}

// function Button({
//   fullWidth = false,
//   disabled = false,
//   variant = "primary",
// }: Props) {
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", fullWidth = false, ...props }, ref) => {
    // props.children;
    const buttonClasses = classNames(buttonVariants({ variant, className }), "text-xs", {
      "full-width": fullWidth,
    });
    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Button;
