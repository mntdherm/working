import type { ReactNode } from "react";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex-grow">
      {children}
      <Footer />
    </div>
  );
}
