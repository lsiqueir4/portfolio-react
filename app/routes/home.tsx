import type { Route } from "./+types/home";
import Hero from "../components/Hero"
import Contacts from "../components/Contacts"

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
      <Contacts />
    </>
  )
}