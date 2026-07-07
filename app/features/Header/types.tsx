import type { ReactNode } from "react";

export type HeaderButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};
