import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Ife Journal of Information and Communication Technology",
  description: "Ife Journal of Information and Communication Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* reCAPTCHA v3 */}
        <Script src="https://www.google.com/recaptcha/api.js?render=6LdaNSQpAAAAAAODPgR3XroopgEJ1gyLUac8yv51" strategy="beforeInteractive"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
