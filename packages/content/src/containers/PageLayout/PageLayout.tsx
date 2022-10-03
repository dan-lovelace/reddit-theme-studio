import { ReactNode } from "react";

import { Header } from "../../components/Header";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-layout">
      <Header />
      <div className="page-layout__body">{children}</div>
    </div>
  );
}
