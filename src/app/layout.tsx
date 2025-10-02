import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextAuthProvider from "@/providers/next-auth-provider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carrologia – Pesquise carros, descubra fichas técnicas e problemas",
  description: "Carrologia é o site completo de pesquisa automotiva. Encontre informações detalhadas sobre qualquer carro: ficha técnica, consumo, desempenho, histórico de problemas, recalls, avaliações de usuários e mais. Compare modelos, descubra características técnicas e tome decisões informadas, tudo sem comprar nenhum carro. Ideal para entusiastas e pessoas que querem conhecer melhor seus veículos ou futuros carros.",
  keywords: [
    "Carrologia", 
    "pesquisa de carros", 
    "ficha técnica", 
    "problemas de carros", 
    "recalls de carros", 
    "avaliação de veículos", 
    "comparar carros", 
    "informações automotivas", 
    "carros usados", 
    "carros novos"
  ],
  authors: [
    { name: "Carrologia", url: "https://carrologia.online" }
  ],
  openGraph: {
    title: "Carrologia – Pesquise e descubra tudo sobre carros",
    description: "Descubra fichas técnicas, histórico de problemas, recalls, avaliações e características detalhadas de diversos modelos de carros. Carrologia ajuda você a tomar decisões informadas sobre veículos, sem vender nenhum carro.",
    url: "https://carrologia.online",
    siteName: "Carrologia",
    images: [
      {
        url: "https://res.cloudinary.com/dm0tmsgor/image/upload/v1759429794/carrologia-logo_mc3slp.png",
        width: 1200,
        height: 630,
        alt: "Carrologia – pesquisa completa de carros"
      }
    ],
    locale: "pt_BR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Carrologia – Pesquise carros e descubra tudo sobre eles",
    description: "Fichas técnicas, problemas, recalls e avaliações de carros em um só lugar. Carrologia: seu guia automotivo completo, sem vendas.",
    images: ["https://res.cloudinary.com/dm0tmsgor/image/upload/v1759429794/carrologia-logo_mc3slp.png"],
    site: "@carrologia",
    creator: "@carrologia"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-90SD525XF7`} />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-90SD525XF7');
        `}
        </Script>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MQGG9X3H');
          `}
        </Script>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
              n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1465106458036617');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1465106458036617&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQGG9X3H"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <NextAuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
