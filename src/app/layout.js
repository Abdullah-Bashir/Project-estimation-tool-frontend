import ClientProviders from "./components/clientProvider";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // ✅ Import Script properly
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project Manager",
  description: "Tool to manage large projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme switching script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var savedTheme = localStorage.getItem('theme');
                var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var theme = savedTheme || systemTheme;
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          {children}
          <div id="modal-root" />
        </ClientProviders>

        {/* ✅ Load lordicon properly */}
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
