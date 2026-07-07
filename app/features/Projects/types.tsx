import type { IconType } from "react-icons";

interface Tech {
  name: string;
  icon: IconType;
}

export type ProjectContainerProps = {
  title: string;
  description: string;
  usedTechs: Tech[];
  link: string;
  image: string;
};

export type ProjectData = {
  id: string;
  usedTechs: Tech[];
  link: string;
  image: string;
};
