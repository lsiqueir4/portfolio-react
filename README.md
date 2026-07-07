🇧🇷 Português | 🇺🇸 [English](README.en.md)

# Portfolio

Portfolio pessoal de Leandro Siqueira, construído com React 19, React Router 7 (SSR), TypeScript e Tailwind CSS 4. Apresenta seções de Header, Hero, Projetos, Sobre Mim, Contatos e Footer.

## Demonstração ao Vivo

🔗 [https://lsiqueira.dev.br](https://lsiqueira.dev.br)

## Funcionalidades

- **Alternância de tema claro/escuro** — toggle no Header, com preferência salva no `localStorage` e detecção automática do `prefers-color-scheme` do navegador. Aplica o tema antes da primeira renderização, sem flash visual, mantendo o roxo como cor de destaque em ambos os temas.
- **Alternância de idioma PT-BR/EN** — toggle no Header usando `react-i18next`, com detecção automática do idioma do navegador, persistência via `localStorage` e tradução de todo o conteúdo visível ao usuário.
- **Seis seções de portfolio** — Header (navegação), Hero (introdução e stack), Projetos, Sobre Mim (experiências, formação e habilidades), Contatos (WhatsApp, e-mail, LinkedIn) e Footer.
- **Sistema de tokens de tema centralizado** — tokens semânticos de cor (`surface`, `accent`, `muted`, `border-subtle`, entre outros) substituem classes Tailwind com cores fixas em todas as seções, com componentes compartilhados `Section`/`Button` para eliminar duplicação de padrões visuais.

## Stack Tecnológica

- **React** 19.2.6 — biblioteca de UI
- **React Router** 7.15.1 — roteamento e SSR (renderização no servidor)
- **TypeScript** 5.9.3 — tipagem estática
- **Tailwind CSS** 4.2.2 — estilização utility-first
- **i18next** / **react-i18next** — internacionalização (PT-BR/EN)
- **lucide-react** / **react-icons** — bibliotecas de ícones
- **@fontsource/outfit** — fonte Outfit auto-hospedada
- **Vite** — build tool e servidor de desenvolvimento

## Como Executar

### Localmente com npm

```bash
npm install
npm run dev
```

Para build de produção:

```bash
npm run build
npm run start
```

### Com Docker

O projeto inclui um `Dockerfile` multi-stage. Para construir e rodar o container:

```bash
docker build -t dev-portfolio-react .
docker run -p 3000:3000 dev-portfolio-react
```

O comando executado dentro do container (`CMD` final da imagem) é `npm run start`.

## Estrutura do Projeto

O código-fonte fica em `app/features/`, com um diretório por seção do portfolio: `Header`, `Hero`, `Projects`, `AboutMe`, `Contacts` e `Footer`. Cada diretório de feature segue o padrão `index.tsx` (componente), `data.tsx` (dados estáticos) e `types.tsx` (tipos TypeScript).

## Licença

Este projeto está licenciado sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
