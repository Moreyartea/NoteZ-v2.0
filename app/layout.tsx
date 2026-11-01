import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NoteZ v2.0 - Pure Offline Super-App",
  description: "Aplikasi produktivitas dan pencatatan harian pribadi all-in-one bergaya Neo-Brutalism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('notez_theme_id') || localStorage.getItem('notez_theme') || 'classic-brutal';
                document.documentElement.setAttribute('data-theme', savedTheme);
                if (savedTheme !== 'classic-brutal') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-[#FFFDF7] dark:bg-[#121212] text-[#0A0A0A] dark:text-[#F4F4F0]">
        {children}
      </body>
    </html>
  );
}
