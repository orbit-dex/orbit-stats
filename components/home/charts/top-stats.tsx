'use client'
import React from 'react';
import { Box, Text, Grid, Card, Spinner } from '@chakra-ui/react';
import { useRequest } from '@/hooks/useRequest';
import { formatNumber } from '@/utils/formatting';
import {
    total_users,
    total_usd_volume,
    total_deposits,
    total_withdrawals,
    total_notional_liquidated
} from "@/constants/api";

const REQUESTS = [
    total_users,
    total_usd_volume,
    total_deposits,
    total_withdrawals,
    total_notional_liquidated
];

const Loader = () => <Box w="100%" display="flex" justifyContent="center"><Spinner display="flex" w="20px" h="20px" /></Box>;

const TopStats = () => {
    const [dataTotalUsers, loadingTotalUsers, errorTotalUsers] = useRequest(REQUESTS[0], 0, "total_users", true);
    const [dataTotalUsdVol, loadingUsdVol, errorUsdVol] = useRequest(REQUESTS[1], 0, "total_usd_volume", true);
    const [dataTotalDeposits, loadingTotalDeposits, errorTotalDeposits] = useRequest(REQUESTS[2], 0, "total_deposits", true);
    const [dataTotalWithdrawals, loadingTotalWithdrawals, errorTotalWithdrawals] = useRequest(REQUESTS[3], 0, "total_withdrawals", true);
    const [dataTotalNotionalLiquidated, loadingTotalNotionalLiquidated, errorTotalNotionalLiquidated] = useRequest(REQUESTS[4], 0, "total_notional_liquidated", true);

    return (
        <Box bg="black" width="100vw" position="relative" left="50%" right="50%" marginLeft="-50vw" marginRight="-50vw">
            <Grid
                gridTemplateColumns={{
                    base: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(5, 1fr)',
                }}
                gap={5}
                maxWidth="1280px"
                margin="0 auto"
                padding="0 20px"
                mt="2rem"
            >
                <Card bg="#A78BFA" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                    <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center" color="#000000">
                        {dataTotalUsers ? formatNumber(dataTotalUsers) : errorTotalUsers ? "-" : null}
                    </Text>
                    <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalUsers} color="#000000">
                        Total Users
                    </Text>
                    {loadingTotalUsers && <Loader />}
                </Card>
                <Card bg="#A78BFA" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                    <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center" color="#000000">
                        {dataTotalUsdVol ? `$${formatNumber(dataTotalUsdVol, 0)}` : errorUsdVol ? "-" : null}
                    </Text>
                    <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalUsdVol} color="#000000">
                        Total non-HLP Volume
                    </Text>
                    {loadingUsdVol && <Loader />}
                </Card>
                <Card bg="#A78BFA" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                    <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center" color="#000000">
                        {dataTotalDeposits ? `$${formatNumber(dataTotalDeposits, 0)}` : errorTotalDeposits ? "-" : null}
                    </Text>
                    <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalDeposits} color="#000000">
                        Total Deposits
                    </Text>
                    {loadingTotalDeposits && <Loader />}
                </Card>
                <Card bg="#A78BFA" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                    <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center" color="#000000">
                        {dataTotalWithdrawals ? `$${formatNumber(dataTotalWithdrawals, 0)}` : errorTotalWithdrawals ? "-" : null}
                    </Text>
                    <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalWithdrawals} color="#000000">
                        Total Withdrawals
                    </Text>
                    {loadingTotalWithdrawals && <Loader />}
                </Card>
                <Card bg="#A78BFA" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                    <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center" color="#000000">
                        {dataTotalNotionalLiquidated ? `$${formatNumber(dataTotalNotionalLiquidated, 0)}` : errorTotalNotionalLiquidated ? "-" : null}
                    </Text>
                    <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalNotionalLiquidated} color="#000000">
                        Total Notional Liquidated
                    </Text>
                    {loadingTotalNotionalLiquidated && <Loader />}
                </Card>
            </Grid>
        </Box>
    );
};

export default TopStats;
