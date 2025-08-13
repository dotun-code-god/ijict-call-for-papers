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
      </head>
      <body>
        {children}
        {/* reCAPTCHA v3 */}
        <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`} strategy="afterInteractive"/>
      </body>
    </html>
  );
}
