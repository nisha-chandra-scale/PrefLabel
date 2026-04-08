import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrefLabel — Human Preference Annotation",
  description: "Collect human preference data on LLM outputs for RLHF training pipelines",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-bright font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
