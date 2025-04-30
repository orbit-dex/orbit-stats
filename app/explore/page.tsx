'use client'
import React from 'react';
import Explore from '@/components/home/explore';
import { Box } from '@chakra-ui/react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function Page() {
  return (
    <>
      <Header />
      <Box as="main" maxW="container.xl" mx="auto" px={4} py={8} minH="100vh" bg="black">
        <Explore />
      </Box>
      <Footer />
    </>
  );
} 