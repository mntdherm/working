const FINNISH_CITIES = [
  { name: 'Helsinki', image: '/images/cities/helsinki.jpg', count: 45 },
  { name: 'Espoo', image: '/images/cities/espoo.jpg', count: 32 },
  { name: 'Tampere', image: '/images/cities/tampere.jpg', count: 28 },
  { name: 'Vantaa', image: '/images/cities/vantaa.jpg', count: 25 },
  { name: 'Oulu', image: '/images/cities/oulu.jpg', count: 20 },
  { name: 'Turku', image: '/images/cities/turku.jpg', count: 18 },
];

export default function CityGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          Suosituimmat kaupungit
        </h2>
        <p className="mt-4 text-xl text-gray-600 text-center">
          Löydä autopesulat läheltäsi
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FINNISH_CITIES.map((city) => (
            <div
              key={city.name}
              className="relative overflow-hidden rounded-lg group cursor-pointer"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white">{city.name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {city.count} autopesupalvelua
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
