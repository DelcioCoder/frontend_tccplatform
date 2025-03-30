import "./globals.css"
import { EditingProvider } from "@/contexts/EditingContext"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className="antialiased">
          <EditingProvider>
            {children}
          </EditingProvider>
        </body>
      </html>
    );
  }