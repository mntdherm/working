import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Yritys</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  Tietoa meistä
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Ota yhteyttä
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-gray-900">
                  Työpaikat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Yrityksille</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/list-your-business" className="text-gray-600 hover:text-gray-900">
                  Lisää yrityksesi
                </Link>
              </li>
              <li>
                <Link to="/business/login" className="text-gray-600 hover:text-gray-900">
                  Yritysten kirjautuminen
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
                  Hinnoittelu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Asiakkaille</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900">
                  Ohjeet
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900">
                  UKK
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-gray-900">
                  Asiakastuki
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Laillisuus</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  Tietosuojaseloste
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Käyttöehdot
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-gray-900">
                  Evästekäytäntö
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Autopesu Markkinapaikka. Kaikki oikeudet pidätetään.
            </p>
            <div className="flex space-x-6">
              <a href="https://facebook.com" className="text-gray-400 hover:text-gray-500">
                Facebook
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-500">
                Twitter
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-gray-500">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
