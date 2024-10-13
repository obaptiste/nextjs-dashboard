import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children} <Analytics />
      </body>
    </html>
  );
}
