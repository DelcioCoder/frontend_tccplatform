import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | TCC Connect',
    default: 'TCC Connect',
  },
  robots:
    {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        nocache: true,
      },
    },
  description: 'TCC Connect é a plataforma colaborativa que une estudantes de TCC a orientadores especializados. Converse em chat ao vivo, gerencie prazos acadêmicos e tenha suporte para desenvolver seu trabalho de conclusão de curso.',
  keywords: ['TCC', 'orientador', 'suporte acadêmico', 'chat ao vivo', 'prazos acadêmicos'],
  openGraph: {
    title: 'TCC Connect',
    description: 'Converse com orientadores especializados, gerencie prazos e desenvolva seu TCC com suporte completo.',
    url: 'https://tccconnect.com',
    siteName: 'TCC Connect',
    images: [
      {
        url: 'https://tccconnect.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TCC Connect',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TCC Connect',
    description: 'Converse com orientadores especializados, gerencie prazos e desenvolva seu TCC com suporte completo.',
    images: ['https://tccconnect.com/og-image.jpg'],
  },
};

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