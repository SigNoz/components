import "./index.css";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import buttonVariants from "./button-variants";

import { cn } from "./lib/utils";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  theme?: "light" | "dark";
}

interface ArrowIconProps { 
 stroke: string; 
 className: string;
}

const svgLeftVariants = ({ size }: { size?: "xs" | "sm" | "md" | "lg" | null | undefined  }) => {
  return cn({
    "w-2.5 ml-2 mr-1.5": size === "xs",
    "w-4 ml-4 mr-2":     size === "sm",
    "w-4 ml-4 mr-2 h-4": size === "md",
    "w-5 h-5 ml-6 mr-2": size === "lg",
  });
};

const svgRighttVariants = ({ size }: { size?: "xs" | "sm" | "md" | "lg" | null | undefined }) => {
  return cn({
    "w-2.5 ml-1.5 mr-2": size === "xs",
    "w-4 ml-2 mr-4":     size === "sm",
    "w-4 ml-2 mr-4 h-4": size === "md",
    "w-5 h-5 ml-2 mr-6": size === "lg",
  });
};


const ArrowIcon = ({stroke, className}: ArrowIconProps) => (
  <svg 
    className={className}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.7776 20.7145L25.4919 14.0002L18.7776 7.28595"
      stroke={stroke}
      stroke-width="2.51786"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.82513 7.28595L3.11084 14.0002L9.82513 20.7145"
      stroke={stroke}
      stroke-width="2.51786"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);


const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, children, theme = "light", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const stroke = variant === 'warning' ? 'black' : variant === 'link' ? '#4E74F8' : 'white';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, theme, className }))}
        ref={ref}
        {...props}
      >
        <ArrowIcon
          stroke={stroke}
          className={cn(svgLeftVariants({ size }))}
        />
        {children}
        <ArrowIcon
          stroke={stroke}
          className={cn(svgRighttVariants({ size }))}
        />
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
