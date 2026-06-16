import type { Route } from "./+types/home";
import Hero from "../components/Hero"
import Contacts from "../components/Contacts"
import Projects from "~/components/Projects";
import Aboutme from "../components/AboutMe"
import Footer from "../components/Footer"

export function meta({ }: Route.MetaArgs) {
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
  )
}