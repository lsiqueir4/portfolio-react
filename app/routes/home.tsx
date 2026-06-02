import type { Route } from "./+types/home";
import { Welcome } from "../components/welcome";
import { Header } from "../components/header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portifolio - Leandro" },
    { name: "description", content: "Portifolio - Leandro" },
  ];
}

export default function Home() {
  return (
  <>
    <Header />
    <Welcome />
  </>
  )
  ;
}
