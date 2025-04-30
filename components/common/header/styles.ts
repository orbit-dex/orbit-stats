import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';
import theme from '../../../styles/theme';

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
`;

export const LogoTextWrapper = styled(Box)`
  display: flex;
  position: relative;
  left: -0.5rem;
  /* height: 24px;

  @media only screen and (max-width: ${theme.breakpoints.md}) {
    height: 18px;
  } */

  svg {
    height: 100%;
    width: auto;
  }
`;

export const FeatureImg = styled(Box)`
  display: flex;
  position: absolute;
  top: -105px;
  left: -200px;

  @media only screen and (max-width: ${theme.breakpoints.md}) {
    top: -150px;
    left: -250px;
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  background: #000000;
  border-radius: 100px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 12px rgba(7,39,35,.06);
  margin: 1rem 0;
  
  @media (max-width: 700px) {
    padding: 0.5rem 1rem;
  }
`;

export const NavLink = styled.a`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #97ffe4;
  }
`;
