import React from "react";
import cn from "classnames";
import styles from "./Text.module.scss";

export type TextColor =
  | "primary"
  | "secondary"
  | "accent"
  | "white"
  | "black"
  | "neutral-500"
  | "gray"
  | "green"
  | "orange";

export type TextType =
  | "display"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "subtitle-lg"
  | "subtitle-sm"
  | "paragraph-lg"
  | "paragraph-lg-semibold"
  | "paragraph-sm-semibold"
  | "paragraph-sm"
  | "label";

export type TextWeight =
  | "regular"
  | "medium"
  | "semi-bold"
  | "bold"
  | "extra-bold";

export type TextFont = "rubik" | "inconsolata" | "jersey-10-regular";

export type TextProps = {
  textType: TextType;
  textWeight?: TextWeight;
  textColor?: TextColor;
  textFont?: TextFont;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
};

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      textType = "paragraph-sm",
      textWeight = "regular",
      textColor = "black",
      textFont = "rubik",
      as,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as ?? "span";

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(
          styles[`color--${textColor}`],
          styles[`wght--${textWeight}`],
          styles[`type--${textType}`],
          styles.text,
          styles[`font--${textFont}`],
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

export default Text;
