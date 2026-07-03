import type { ReactNode } from "react";

export type HeaderButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};

export type ActionButtonProps = {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
};