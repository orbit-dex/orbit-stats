import { ChakraProvider } from '@chakra-ui/react';
import theme from "../styles/theme";
import { Providers } from "./providers";

export const metadata = {
  title: 'Orbit',
  description: 'Explore the Orbit protocol',
  icons: {
    icon: [],
    shortcut: [],
    apple: [],
    other: []
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width" />      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
