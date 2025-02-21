import type { MetaFunction } from "@remix-run/node";
import Layout from "~/components/layout/Layout";
import SearchSection from "~/components/home/SearchSection";
import CityGrid from "~/components/home/CityGrid";
import HowItWorks from "~/components/home/HowItWorks";
import FeaturedSection from "~/components/home/FeaturedSection";

export const meta: MetaFunction = () => {
  return [
    { title: "Autopesu Markkinapaikka - Löydä ja varaa autopesu helposti" },
    { name: "description", content: "Varaa autopesu helposti ja nopeasti. Vertaile hintoja ja lue arvosteluja." },
  ];
};

export default function Index() {
  return (
    <Layout>
      <SearchSection />
      <HowItWorks />
      <CityGrid />
      <FeaturedSection />
    </Layout>
  );
}
