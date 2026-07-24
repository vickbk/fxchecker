import "react";

declare module "react" {
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    command?:
      | "show-modal"
      | "toggle-popover"
      | "show-popover"
      | "hide-popover"
      | "close"
      | "request-close";
    commandfor?: string;
  }
}
