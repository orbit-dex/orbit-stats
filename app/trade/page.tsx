'use client'
import React from 'react';
import Trade from '@/components/home/trade';
import { Box } from '@chakra-ui/react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function TradePage() {
  return (
    <>
      <Header />
      <Box as="main" maxW="100%" mx="auto" minH="100vh" bg="black">
        <Trade />
      </Box>
      <Footer />
    </>
  );
} 