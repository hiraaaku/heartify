import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import ClientLayout from './ClientLayout'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'], // pilih weight yang mau dipake
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  generator: 'heartify',
  title: 'Heartify',
  description: 'Heartify Application',
  icons: {
    icon: '/dini.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}