export default function FeaturedSection() {
  const features = [
    {
      title: "Kattava valikoima",
      description: "Löydä itsellesi sopiva autopesu laajasta valikoimastamme",
      icon: "🚗"
    },
    {
      title: "Luotettavat kumppanit",
      description: "Kaikki palveluntarjoajat ovat tarkasti valittuja",
      icon: "🤝"
    },
    {
      title: "Helppo varaus",
      description: "Varaa autopesu muutamalla klikkauksella",
      icon: "📱"
    },
    {
      title: "Asiakasarvostelut",
      description: "Lue muiden kokemuksia ja jaa omasi",
      icon: "⭐"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Miksi valita meidät?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Teemme autopesun varaamisesta helppoa ja luotettavaa
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative rounded-lg border border-gray-200 p-8 text-center"
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-4">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
