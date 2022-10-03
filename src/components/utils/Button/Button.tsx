import React from "react";
import "./button.scss";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
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
  label: string;
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
  size = "medium",
  backgroundColor,
  label,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  const width = fullWidth ? "storybook-button--full-width" : "";
  return (
    <button
      type={type}
      className={[
        "storybook-button",
        `storybook-button--${size}`,
        mode,
        width,
      ].join(" ")}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
