import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <head></head>
      <div className="page-layout">
        <header className="page-layout__header">Header</header>
        <div className="page-layout__body">{children}</div>
        <footer className="page-layout__footer">Footer</footer>
      </div>
    </>
  );
}
