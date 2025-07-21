'use client'
import React from 'react';
import { Box, Text, Flex, Image, Container } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box width="100%" position="relative" paddingTop="0" mt="10">
      <Box width="100%" bg="#050b0c" pt="5" zIndex="2" position="relative">
        <Container maxWidth="container.xl">
          <Flex width="100%" py="6" justifyItems="center" justifyContent="center" flexDirection={{ xs: "column", md: "row" }} alignItems="center">
            <Flex as="a" href='https://orbitfoundation.xyz' target='_blank' rel='noreferrer' cursor="pointer" alignItems="center">
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
