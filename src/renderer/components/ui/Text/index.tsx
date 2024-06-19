import classNames from "classnames";
import { PropsWithChildren } from "react";

type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

interface Props extends PropsWithChildren {
  size?: TextSize;
  className?: string;
}

function Text(props: Props) {
  const textClasses = classNames(
    `text-${props.size || "base"}`,
    props.className
  );
  return <div className={textClasses}>{props.children}</div>;
}

export default Text;
