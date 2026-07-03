import type { Route } from "./+types/home";
import Hero from "~/features/Hero";
import Contacts from "~/features/Contacts";
import Projects from "~/features/Projects";
import Aboutme from "~/features/AboutMe";
import Footer from "~/features/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portifolio - Leandro" },
    { name: "description", content: "Portifolio - Leandro" },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Aboutme />
      <Contacts />
      <Footer />
    </>
  );
}
