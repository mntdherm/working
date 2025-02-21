export default function HowItWorks() {
  const steps = [
    {
      title: "Etsi",
      description: "Löydä lähin autopesula sijainnin perusteella",
      icon: "🔍"
    },
    {
      title: "Vertaile",
      description: "Vertaile hintoja ja lue asiakasarvosteluja",
      icon: "⭐"
    },
    {
      title: "Varaa",
      description: "Valitse sopiva aika ja varaa autopesu helposti",
      icon: "📅"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Näin se toimii
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Kolme helppoa askelta autopesun varaamiseen
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                    {step.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full">
                    <div className="h-0.5 w-full bg-gray-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
