import type { Metadata } from "next";
import "./globals.css";
import "./ain.css";
import "./simulator-office.css";
import "./project-office.css";

export const metadata: Metadata = {
  title: "AKIM — городской проектный офис",
  description: "Бюджет проекта, план пилота, технологии, KPI и проверка решения до масштабирования.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}




