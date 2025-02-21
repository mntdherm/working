import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Header from "~/components/layout/Header";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
];

export default function App() {
  return (
    <html lang="fi" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-screen flex flex-col">
          <Header />
          {/* Add pt-16 to account for fixed header height */}
          <main className="flex-grow pt-16">
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>Oho! Jotain meni pieleen</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow pt-16 bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
            <div className="mx-auto max-w-max">
              <main className="sm:flex">
                <p className="text-4xl font-bold tracking-tight text-blue-600 sm:text-5xl">
                  500
                </p>
                <div className="sm:ml-6">
                  <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                      Jotain meni pieleen
                    </h1>
                    <p className="mt-1 text-base text-gray-500">
                      Pahoittelut häiriöstä. Yritä päivittää sivu tai palaa takaisin myöhemmin.
                    </p>
                  </div>
                  <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                    <a
                      href="/"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Palaa etusivulle
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Ota yhteyttä
                    </a>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
