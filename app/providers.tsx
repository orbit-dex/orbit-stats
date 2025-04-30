'use client';

import { useEffect, useMemo, ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';

import TagManager from 'react-gtm-module';
import theme from '@/styles/theme';
import { GlobalStyles } from '@/styles/global';
import { DataContextProvider } from '@/contexts/data';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const tagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CONFIG as string
};

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <DataContextProvider>
            <ChakraProvider theme={theme}>
              <Global styles={GlobalStyles} />
              {children}
            </ChakraProvider>
          </DataContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}