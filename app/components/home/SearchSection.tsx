import { useState } from "react";
import { Form } from "@remix-run/react";

export default function SearchSection() {
  const [location, setLocation] = useState("");

  const popularCities = [
    "Helsinki",
    "Espoo",
    "Tampere",
    "Vantaa",
    "Oulu",
    "Turku"
  ];

  return (
    <section className="relative bg-blue-600 py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Löydä paras autopesu läheltäsi
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100">
            Varaa autopesu helposti ja nopeasti. Vertaile hintoja ja lue arvosteluja.
          </p>
        </div>

        <div className="mt-10">
          <Form className="mx-auto max-w-xl">
            <div className="flex shadow-sm">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Syötä sijainti tai kaupunki"
                  className="block w-full rounded-l-lg border-0 px-4 py-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="flex-none rounded-r-lg bg-blue-500 px-8 py-4 text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Etsi
              </button>
            </div>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-100">Suosituimmat kaupungit:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => setLocation(city)}
                  className="rounded-full bg-blue-500 bg-opacity-20 px-4 py-1 text-sm text-white hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
