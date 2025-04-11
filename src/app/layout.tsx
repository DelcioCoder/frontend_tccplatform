import "./globals.css"
import { EditingProvider } from "@/contexts/EditingContext"
import { ConversationProvider } from "@/contexts/ConversationContext"
import { PageTransition } from "@/components/PageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PageTransition>
          <ConversationProvider>
            <EditingProvider>
              {children}
            </EditingProvider>
          </ConversationProvider>
        </PageTransition>
      </body>
    </html>
  );
}