import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:warning-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-robin-500 text-primary-foreground shadow hover:bg-robin-500/90",
        danger:
          "bg-cherry-500 text-destructive-foreground shadow-sm hover:bg-cherry-500/90",
        warning:
          "bg-amber-500 text-primary-foreground shadow hover:bg-amber-500/90",
        default:
          "bg-slate-400 text-vanilla-100 shadow-sm hover:bg-slate-400/80",
        ghost: "text-primary-foreground ",
        link: "text-slate-100 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      theme: {
        light: "",
        dark: "dark",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      theme: "light",
    },
    compoundVariants: [
      {
        theme: "dark",
        variant: "default",
        className:
          "bg-robin-500 text-primary-foreground-dark shadow hover:bg-robin-500/90",
      },
      {
        theme: "dark",
        variant: "danger",
        className:
          "bg-cherry-500 text-destructive-foreground shadow-sm hover:bg-cherry-500/90",
      },
      {
        theme: "dark",
        variant: "warning",
        className:
          "border border-input-dark bg-background-dark shadow-sm text-primary-foreground hover:bg-background-dark/80",
      },
      {
        theme: "dark",
        variant: "primary",
        className:
          "bg-robin-500 text-primary-foreground shadow-sm hover:bg-robin-500/80",
      },
      {
        theme: "dark",
        variant: "ghost",
        className: "text-robin-100",
      },
      {
        theme: "dark",
        variant: "link",
        className: "text-vanilla-100 underline-offset-4 hover:underline",
      },
    ],
  }
);

export default buttonVariants;
