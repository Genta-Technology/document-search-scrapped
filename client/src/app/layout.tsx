import "@styles/globals.css";

import { Providers } from "./providers";

import sidebar from "@components/sidebar";

export const metadata = {
  title: "Document Search",
  description: "will be updated",
};

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="app">{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default Rootlayout;
