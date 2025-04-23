'use client'
import React from 'react';
import Portfolio from '@/components/home/portfolio';
import { Box } from '@chakra-ui/react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <Box as="main" maxW="container.xl" mx="auto" px={4} py={8} minH="100vh" bg="black">
        <Portfolio />
      </Box>
      <Footer />
    </>
  );
} 