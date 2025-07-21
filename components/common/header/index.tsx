'use client'
import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Link as ChakraLink,
  Container
} from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <Box 
      as="header" 
      bg="black" 
      borderBottom="1px solid" 
      borderColor="whiteAlpha.100"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
    >
      <Container maxW="container.2xl">
        <Flex 
          h="64px" 
          align="center" 
          justify="space-between"
          px={4}
        >
          {/* Left side - Logo and Title */}
          <Link href="/" passHref>
            <ChakraLink display="flex" alignItems="center" gap={3} _hover={{ textDecoration: 'none' }}>
              <Box position="relative" width="32px" height="32px">
                <Image
                  src="/logo.svg"
                  alt="Orbit Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
              <Text color="white" fontWeight="semibold" fontSize="lg">Orbit</Text>
            </ChakraLink>
          </Link>

          {/* Right side - Navigation and Connect */}
          <HStack spacing={8}>
            <HStack spacing={6}>
              <Link href="/trade" passHref>
                <ChakraLink color="whiteAlpha.800" _hover={{ color: 'white', textDecoration: 'none' }}>
                  Trade
                </ChakraLink>
              </Link>
              <Link href="/pairs" passHref>
                <ChakraLink color="whiteAlpha.800" _hover={{ color: 'white', textDecoration: 'none' }}>
                  Strategies
                </ChakraLink>
              </Link>
              <ChakraLink 
                href="https://vaults.orbit2.xyz/vaults" 
                color="whiteAlpha.800" 
                _hover={{ color: 'white', textDecoration: 'none' }}
                isExternal
              >
                  Vault
                </ChakraLink>
            </HStack>
            
            <Button
              bg="#9945FF"
              color="white"
              _hover={{ bg: "#8134EB" }}
              size="sm"
              borderRadius="lg"
              px={4}
            >
              Connect
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
