'use client'
import React, { useState } from 'react';
import moment from "moment";
import { Container, Box, Text, Grid, Flex, Button, Select } from '@chakra-ui/react';
import * as S from './styles';
import TopStats from '../charts/top-stats';
import VolumeNonMMChart from '../charts/volume-non-hlp';
import VolumeNumTrades from '../charts/volume-num-trades';
import OpenInterestChart from '../charts/open-interest';
import TradersProfitLossChart from '../charts/trader-profit';
import HLPProfitLossChart from '../charts/hlp-liquidator-profit';
import { DateRangeSelect } from '../charts/date-range';
import FundingRateChart from '../charts/funding-rate';
import CumulativeUsersChart from '../charts/cumulative-users';
import CoinTradesByUsers from "../charts/uniquie-users-coin";
import CumulativeInflowChart from '../charts/cumulative-inflow';
import CumulativeNotionalLiquidatedChart from '../charts/cumulative-notional-liquidated';
import TableLargestUsers from "../tables/largest-users"
import TableUserDesposits from "../tables/user-deposits"
import TableLiquidatedNotional from "../tables/liquidated-notional-user"
import TableTradeCount from "../tables/user-trade-count"
import Liquidity from "../charts/liquidity"


const Main = () => {
    const [timeframe, setTimeframe] = useState<string>('30D');
    const [chartType, setChartType] = useState<string>('Cumulative');

    return (
        <Container
            maxWidth='100%' my='0' position='relative' zIndex='2' mt="0" mb="2rem"
            p={{ xs: 0, md: '0' }}
        >
            <Box
                width="100%" height="220px"
                background="#000000"
                display="flex"
                alignItems="center"
                mt="0"
            >
                <Box display="flex" w="100%" justifyContent="center" alignContent="center">
                    <Text textAlign="center" fontSize="3.8rem" lineHeight="3.6rem" color="#fff" display="flex" fontFamily="Teodor" fontWeight="500">
                        Orbit
                    </Text>
                </Box>
            </Box>
            <Box position="relative" width='100%'
                p={{ xs: 0, md: '1rem' }}
                bg="#000000" borderRadius="35px" minHeight="3000px">
                <Flex
                    position="relative" width='100%' px="3" zIndex="11"
                    pt={{ xs: '1rem', md: 0 }}
                    justifyContent="center"
                >
                    <DateRangeSelect />
                </Flex>
                <Box position="relative" width='100%' px={{ xs: '0', md: '3' }} zIndex="9" >
                    <Box width={{ xs: '100%', md: '100%' }} mt="3" p={{ xs: '2', md: '0 0 0 0' }}>
                        <TopStats />
                    </Box>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <VolumeNonMMChart />
                        <VolumeNumTrades />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <CumulativeUsersChart />
                        <CoinTradesByUsers />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <TradersProfitLossChart />
                        <HLPProfitLossChart />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <CumulativeInflowChart />
                        <CumulativeNotionalLiquidatedChart />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <OpenInterestChart />
                        <Liquidity />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(1, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <FundingRateChart />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <TableLargestUsers />
                        <TableUserDesposits />
                    </Grid>
                    <Grid templateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }} gap={{ xs: "2", md: "3" }}>
                        <TableLiquidatedNotional />
                        <TableTradeCount />
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Main;
