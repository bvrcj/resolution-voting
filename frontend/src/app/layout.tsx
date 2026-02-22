import "./globals.css";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import TempleFooter from "@/components/layout/TempleFooter";
import TempleHeader from "@/components/layout/TempleHeader";

const barlow = localFont({
  src: "../../Barlow-Regular.952f8963.ttf",
  variable: "--font-barlow"
});

export const metadata = {
  title: "|| Om Namah Shivaya || Om Namo Narayanaya ||",
  description: "Rooms, resolutions, and voting dashboard",
  icons: {
    icon: "/img.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${barlow.className} ${barlow.variable} font-body`}>
        <div className="min-h-screen">
          <TempleHeader />
          <main className="main-scroll">{children}</main>
          <TempleFooter />
        </div>
      </body>
    </html>
  );
}
