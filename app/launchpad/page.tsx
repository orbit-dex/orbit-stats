'use client'
import React from 'react';
import Launchpad from '@/components/home/launchpad';
import { Box } from '@chakra-ui/react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function LaunchpadPage() {
  return (
    <>
      <Header />
      <Box as="main" maxW="container.xl" mx="auto" px={4} py={8} minH="100vh" bg="black">
        <Launchpad />
      </Box>
      <Footer />
    </>
  );
} 