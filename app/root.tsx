import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Header } from "./features/Header";
import { THEME_STORAGE_KEY } from "./constants/theme";
import { LANGUAGE_STORAGE_KEY } from "./constants/language";
import "./i18n/config";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Zero-interpolation static script: THEME_STORAGE_KEY (imported from
// ./constants/theme, the single shared copy used by app/hooks/useTheme.ts
// too) is a compile-time constant, not a runtime value, so this string is
// safe to inject via dangerouslySetInnerHTML (Security V5 / threat T-02-02).
// Keep this fallback logic byte-for-byte identical to app/hooks/useTheme.ts's
// detectBrowserTheme().
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var isDark = stored === "dark" || stored === "light"
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;

// Zero-interpolation static script: LANGUAGE_STORAGE_KEY (imported from
// ./constants/language, the single shared copy used by app/hooks/useLanguage.ts
// too) is a compile-time constant, not a runtime value, so this string is
// safe to inject via dangerouslySetInnerHTML (Security V5 / threat T-03-01).
// No navigator.language value is interpolated into the script source — it is
// read at runtime inside the IIFE. Keep this fallback logic byte-for-byte
// identical to app/hooks/useLanguage.ts's detectBrowserLanguage().
const languageInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${LANGUAGE_STORAGE_KEY}");
    var lang;
    if (stored === "pt" || stored === "en") {
      lang = stored;
    } else {
      var locale = (navigator.language || "").toLowerCase();
      lang = locale.indexOf("pt") === 0 ? "pt" : "en";
    }
    document.documentElement.lang = lang;
  } catch (e) {}
})();
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: languageInitScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
