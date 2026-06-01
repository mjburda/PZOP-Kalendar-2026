import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { sql } from "./sql";
import "./app.css";

export const links = () => [
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
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
  },
];

export async function loader() {
  try {
    const res = await sql("SELECT * FROM pzop_user WHERE is_active = 1 LIMIT 1");
    const activeUser = res[0] || (await sql("SELECT * FROM pzop_user LIMIT 1"))[0];
    return { activeUser: activeUser || null };
  } catch (error) {
    console.error("Chyba DB:", error);
    return { activeUser: null };
  }
}

export function Layout({ children }) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
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
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Jejda! Něco se pokazilo.";
  let details = "Došlo k neočekávané chybě.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Chyba";
    details = error.status === 404 ? "Požadovaná stránka nebyla nalezena." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">{message}</h1>
        <p className="text-gray-600 font-medium mb-6">{details}</p>
        {stack && (
          <pre className="w-full p-4 bg-gray-100 rounded-xl overflow-x-auto text-left text-xs text-red-500">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}