import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <head></head>
      <body>{children}</body>
    </>
  );
}
