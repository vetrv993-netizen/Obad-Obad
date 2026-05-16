import "./globals.css";

export const metadata = {
  title: "Nutrition Calculator",
  description: "Calculate your nutrition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
