'use client'
import type { NextPage } from 'next';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import Main from '@/components/home/main';

const LeaderboardPage: NextPage = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

export default LeaderboardPage; 