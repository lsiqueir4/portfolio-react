import type { IconType } from "react-icons";

export interface Tech {
  name: string;
  icon: IconType;
}

export interface Course {
  name: string;
  institution: string;
  conclusionYear: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  activities: string[];
}
