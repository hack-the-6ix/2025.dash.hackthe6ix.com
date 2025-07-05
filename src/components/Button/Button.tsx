import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "next" | "back" | "primary" | "secondary";
  children?: React.ReactNode;
  darkMode?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "next",
  children,
  className = "",
  darkMode = false,
  ...props
}) => {
  const baseStyles = `disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed disabled:border-0 rounded-md sm:px-8 px-4 py-2 font-semibold transition h-[44px] sm:w-auto w-full border flex items-center justify-center cursor-pointer z-10`;
  const variantStyles =
    variant === "back"
      ? `bg-transparent ${
          darkMode
            ? "border-white text-white hover:bg-[#66799180]"
            : "border-[#008F81] text-[#008F81] hover:bg-[#a0e6fa]"
        }`
      : variant === "primary"
        ? `bg-[#008F81] border-transparent ${
            darkMode
              ? "text-white hover:bg-[#007A6E]"
              : "text-white hover:bg-[#007A6E]"
          }`
        : variant === "secondary"
          ? `bg-transparent text-[#008F81] border-[#008F81] hover:bg-[#a0e6fa]`
          : `bg-[#008F81] border-transparent ${
              darkMode
                ? "text-white hover:bg-[#007A6E]"
                : "text-white hover:bg-[#007A6E]"
            }`;

  if (children) {
    return (
      <button
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    ></button>
  );
};

export default Button;
