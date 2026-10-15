import "./globals.css";

export const metadata = {
  title: "Student Fee Management",
  description: "Track paid and pending student fees.",
};

// Server Component: renders the HTML shell, ships no JavaScript of its own.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
