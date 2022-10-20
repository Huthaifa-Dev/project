import React, { ReactNode } from "react";
import "./button.scss";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  disabled?: boolean;
  /**
   * Is this the full width on the page?
   */
  fullWidth?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  children?: ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  type = "button",
  primary = false,
  disabled = false,
  size = "medium",
  backgroundColor,
  fullWidth = false,
  children = "Button",
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  const width = fullWidth ? "storybook-button--full-width" : "";
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "storybook-button",
        `storybook-button--${size}`,
        mode,
        width,
      ].join(" ")}
      style={{ backgroundColor }}
      {...props}
    >
      {children}
    </button>
  );
};
