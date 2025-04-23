'use client'
import React from 'react';
import NextImg from "next/image"
import { Container, Box, Text, Image, Flex, useMediaQuery, Link, Button } from '@chakra-ui/react';
import * as S from './styles';
import NextLink from 'next/link';

const Header = () => {
  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const navLinks = [
    { name: 'Trade', path: '/trade' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Explore', path: '/explore' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Launchpad', path: '/launchpad' },
  ];

  return (
    <Container maxWidth='100%' position='relative' zIndex='9' m="0" px="1rem">
      <Box
        my="0"
        width='100%'
        background="#000"
        boxShadow="0 2px 12px rgba(7,39,35,.06)"
        py="3"
        px="1rem"
        borderRadius="100px"
        display='flex'
      >
        <Box
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent={{ xs: 'center', md: 'space-between' }}
          zIndex='2'
          paddingY='0'
        >
          <Flex alignItems='center' gap={4}>
            <Flex as="a" href='/' cursor="pointer" alignItems="center">
              <S.LogoWrapper>
                <NextImg src="/img/orbit-logo-w.png" alt="Cursor" width={28} height={28} style={{ filter: 'invert(1)' }} />
              </S.LogoWrapper>
            </Flex>
            <Button
              bg="#A78BFA"
              color="black"
              _hover={{ bg: '#8B5CF6' }}
              size="sm"
              borderRadius="xl"
              fontWeight="600"
            >
              Connect Wallet
            </Button>
          </Flex>

          <Flex 
            display={{ base: 'none', md: 'flex' }} 
            gap={6} 
            alignItems="center"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                as={NextLink}
                href={link.path}
                color="white"
                _hover={{ color: '#97ffe4' }}
                fontSize="md"
                fontWeight="medium"
              >
                {link.name}
              </Link>
            ))}
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default Header;
