import type { ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  href?: string;
  primary?: boolean;
};