import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers";
import { ClientLayout } from "./components/ClientLayout";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopShifter",
  description: "Your modern e-commerce solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <ReduxProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
