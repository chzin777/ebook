import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Hydrate from "./_components/Hydrate/Hydrate";
import { Toaster } from "@/components/ui/sonner";

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ebook R3",
  description: "Criado por R3 Tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserratSans.variable} antialiased`}>
        <Hydrate>
          {children}
          <Toaster />
        </Hydrate>
      </body>
    </html>
  );
}
