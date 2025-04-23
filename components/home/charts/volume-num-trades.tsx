import {
    Bar,
    Label,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Line
} from 'recharts';
import { Box, Text, useMediaQuery } from "@chakra-ui/react"
import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper from '../../common/chartWrapper';
import {
    CHART_HEIGHT,
    YAXIS_WIDTH,
    BRIGHT_GREEN,
    BRAND_GREEN_2,
    BRAND_GREEN_3,
} from "../../../constants";
import {
    tooltipFormatter,
    tooltipLabelFormatter,
    yaxisFormatterNumber,
    xAxisFormatter,
} from '../../../helpers'
import { getTokenHex } from "../../../constants/tokens";
import {
    cumulative_trades,
    daily_trades,
    daily_trades_by_coin,
    daily_trades_by_crossed,
    daily_trades_by_user,
} from "../../../constants/api"

const REQUESTS = [
    daily_trades,
    daily_trades_by_coin,
    daily_trades_by_crossed,
    daily_trades_by_user,
    cumulative_trades,
];

export default function VolumeChart() {
    const [isMobile] = useMediaQuery('(max-width: 700px)');

    const [dataMode, setDataMode] = useState<"COINS" | "MARGIN" | "USER">('COINS');
    const [formattedDataCoins, setFormattedDataCoins] = useState<any[]>([])
    const [formattedDataMarin, setFormattedDataMarin] = useState<any[]>([])
    const [formattedDataUsers, setFormattedDataUsers] = useState<any[]>([])
    const [maxAllValueUser, setMaxAllValueUser] = useState<any>('auto');
    const [uniqueUsers, setUniqueUsers] = useState<any[]>([])
    const [coinKeys, setCoinKeys] = useState<any[]>([])

    const [dataDailyTrades, loadingDailyTrades, errorDailyTrades] = useRequest(REQUESTS[0], [], 'chart_data');
    const [dataDailyTradesByCoin, loadingDailyTradesByCoin, errorDailyTradesByCoin] = useRequest(REQUESTS[1], [], 'chart_data');
    const [dataDailyTradesByMargin, loadingDailyTradesByMargin, errorDailyTradesByMargin] = useRequest(REQUESTS[2], [], 'chart_data');
    const [dataDailyTradesByUser, loadingDailyTradesByUser, errorDailyTradesByUser] = useRequest(REQUESTS[3], [], 'chart_data');
    const [dataCumulativeTrades, loadingCumulativeTrades, errorCumulativeTrades] = useRequest(REQUESTS[4], [], 'chart_data');

    const loading = loadingDailyTrades || loadingDailyTradesByCoin || loadingDailyTradesByMargin || loadingDailyTradesByUser || loadingCumulativeTrades;

    const error = errorDailyTrades || errorDailyTradesByCoin || errorDailyTradesByMargin || errorDailyTradesByUser || errorCumulativeTrades;
    ``

    type CumulativeTradeData = { cumulative: number, time: string };

    const formatTradesByTime = (dataCumulativeUsdVolume: CumulativeTradeData[]): { [key: string]: number } => {
        const result: { [key: string]: number } = {};
        for (const data of dataCumulativeUsdVolume) {
            result[data.time] = data.cumulative;
        }
        return result;
    };

    type DailyTradesData = { time: string, daily_trades: number };

    const formatDailyTradesByTime = (dataDailyTrades: DailyTradesData[]): { [key: string]: number } => {
        const result: { [key: string]: number } = {};
        for (const data of dataDailyTrades) {
            result[data.time] = data.daily_trades;
        }
        return result;
    };

    type CoinTradesData = { coin: string, daily_usd_volume: number, time: string };
    type FormattedCoinTradesData = any[] //{ time: string, all: number, [coin: string]: number };

    const formatDailyTradesByCoins = (
        dataDailyTradesByCoin: { coin: string, daily_trades: number, time: string }[],
        formattedCumulativeTradesByTime: { [key: string]: number },
    ): FormattedCoinTradesData[] => {
        const temp: { [key: string]: { all: number, [coin: string]: number } } = {};
        for (const data of dataDailyTradesByCoin) {
            if (!temp[data.time]) {
                temp[data.time] = { all: 0 };
            }
            temp[data.time][data.coin] = data.daily_trades;
            temp[data.time].all += data.daily_trades;
        }

        const sortAndSliceTop10 = (obj: { [coin: string]: number }) => {
            const sortedEntries = Object.entries(obj)
                .sort(([, aVolume], [, bVolume]) => bVolume - aVolume);
            const top10Entries = sortedEntries.slice(0, 10);
            const otherEntries = sortedEntries.slice(10);

            const otherVolume = otherEntries.reduce((total, [, volume]) => total + volume, 0);
            return {
                ...Object.fromEntries(top10Entries),
                Other: otherVolume
            };
        };

        const result: any[] = Object.entries(temp).map(([time, volumes]) => {
            const top10Volumes = sortAndSliceTop10(volumes);
            return {
                time: new Date(time),
                ...top10Volumes,
                cumulative: formattedCumulativeTradesByTime[time as any],
                unit: '',
            };
        });
        return result;
    };

    const extractUniqueCoins = (formattedCoinTradesData: FormattedCoinTradesData[]): string[] => {
        const coinSet = new Set<string>();
        for (const data of formattedCoinTradesData) {
            Object.keys(data).forEach(coin => {
                if (coin !== 'all' && coin !== 'cumulative' && coin !== 'time' && coin !== 'unit') {
                    coinSet.add(coin);
                }
            });
        }
        const coinsArray = Array.from(coinSet);
        if (coinsArray.includes('Other')) {
            const index = coinsArray.indexOf('Other');
            coinsArray.splice(index, 1);
            coinsArray.push('Other');
        }
        return coinsArray;
    };

    type MarginData = { crossed: boolean, daily_trades: number, time: string };
    type FormattedMarginData = { time: Date, maker: number, taker: number, all: number, cumulative: number };

    const formatTradesByMargin = (
        dataDailyTradesByMargin: MarginData[],
        formattedCumulativeTradesByTime: { [key: string]: number },
    ): FormattedMarginData[] => {
        const groupedByTime: { [key: string]: FormattedMarginData } = {};

        for (const data of dataDailyTradesByMargin) {
            const dateKey = new Date(data.time).toISOString();

            if (!groupedByTime[dateKey]) {
                groupedByTime[dateKey] = {
                    time: new Date(data.time),
                    maker: 0,
                    taker: 0,
                    all: 0,
                    cumulative: 0,
                }
            }

            if (data.crossed) {
                groupedByTime[dateKey].taker += data.daily_trades;
            } else {
                groupedByTime[dateKey].maker += data.daily_trades;
            }
            groupedByTime[dateKey].all += data.daily_trades;
            groupedByTime[dateKey].cumulative = formattedCumulativeTradesByTime[data.time as any];
        }

        return Object.values(groupedByTime);
    }

    const formatData = () => {
        const formattedCumulativeTradesByTime = formatTradesByTime(dataCumulativeTrades)
        const formattedTradesByCoins = formatDailyTradesByCoins(dataDailyTradesByCoin, formattedCumulativeTradesByTime);
        const formattedTradesByMargin = formatTradesByMargin(dataDailyTradesByMargin, formattedCumulativeTradesByTime);
        setMaxAllValueUser(maxAllValueUser);
        setCoinKeys(extractUniqueCoins(formattedTradesByCoins))
        setFormattedDataCoins(formattedTradesByCoins);
        setFormattedDataMarin(formattedTradesByMargin);
    };

    const controls = {
        toggles: [
            {
                text: "Coins",
                event: () => setDataMode('COINS'),
                active: dataMode === 'COINS',
            },
            {
                text: "Maker / Taker",
                event: () => setDataMode('MARGIN'),
                active: dataMode === 'MARGIN',
            }
        ]
    }

    useEffect(() => {
        if (!loading && !error) {
            formatData();
        }
    }, [loading, dataMode])

    return (
        <ChartWrapper
            title="Number Of Trades"
            loading={loading}
            data={dataMode === 'COINS' ? formattedDataCoins : dataMode === 'USER' ? formattedDataUsers : formattedDataMarin}
            controls={controls}
            zIndex={9}
        >
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <ComposedChart data={dataMode === 'COINS' ? formattedDataCoins : dataMode === 'MARGIN' ? formattedDataMarin : formattedDataUsers}>
                    <CartesianGrid strokeDasharray="15 15" opacity={0.1} />
                    <XAxis dataKey="time" tickFormatter={xAxisFormatter} minTickGap={30}
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        unit={""}
                        tickMargin={10}

                    />
                    <YAxis
                        dataKey="all"
                        interval="preserveStartEnd"
                        tickCount={7}
                        domain={['0', maxAllValueUser * 1.1]}
                        tickFormatter={yaxisFormatterNumber}
                        width={YAXIS_WIDTH}
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        unit={""}
                    />
                    <YAxis dataKey="cumulative" orientation="right" yAxisId="right"
                        tickFormatter={yaxisFormatterNumber}
                        width={YAXIS_WIDTH}
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        unit={""}
                    />
                    <Tooltip
                        formatter={tooltipFormatter}
                        labelFormatter={tooltipLabelFormatter}
                        contentStyle={{
                            textAlign: 'left',
                            background: "#0A1F1B",
                            borderColor: "#061412",
                            boxShadow: "0px 0px 7px rgb(0 0 0 / 20%)",
                            borderRadius: "26px",
                            maxHeight: "500px"
                        }}
                        itemSorter={(item) => {
                            return Number(item.value) * -1;
                        }}
                    />
                    {(dataMode === 'COINS' || dataMode === 'MARGIN') && <Legend wrapperStyle={{ bottom: -5 }} />}
                    {
                        dataMode === 'COINS' && (
                            <>
                                {
                                    coinKeys.map(((coinName, i) => {
                                        return (
                                            <Bar
                                                unit={""}
                                                isAnimationActive={false}
                                                type="monotone"
                                                dataKey={coinName}
                                                stackId="a"
                                                name={coinName.toString()}
                                                fill={getTokenHex(coinName.toString())}
                                                key={i}
                                                maxBarSize={20}
                                            />
                                        )
                                    }))
                                }
                            </>
                        )
                    }
                    {
                        dataMode === 'MARGIN' && (
                            <>
                                <Bar
                                    unit={""}
                                    isAnimationActive={false}
                                    type="monotone"
                                    dataKey={'maker'}
                                    stackId="a"
                                    name={'Maker'}
                                    fill={BRAND_GREEN_2}
                                    maxBarSize={20}
                                />
                                <Bar
                                    unit={""}
                                    isAnimationActive={false}
                                    type="monotone"
                                    dataKey={'taker'}
                                    stackId="a"
                                    name={'Taker'}
                                    fill={BRAND_GREEN_3}
                                    maxBarSize={20}
                                />
                            </>
                        )
                    }
                    {
                        dataMode === 'USER' && (
                            <>
                                {
                                    uniqueUsers.map(((user, i) => {
                                        return (
                                            <Bar
                                                unit={""}
                                                isAnimationActive={false}
                                                type="monotone"
                                                dataKey={user}
                                                stackId="a"
                                                name={user}
                                                fill={BRAND_GREEN_2}
                                                key={i}
                                                maxBarSize={20}
                                            />
                                        )
                                    }))
                                }
                            </>
                        )
                    }
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dot={false}
                        strokeWidth={1}
                        stroke={BRIGHT_GREEN}
                        dataKey="cumulative"
                        yAxisId="right"
                        name="Cumulative"
                    />
                </ComposedChart>
            </ResponsiveContainer>
            <Box w="100%" mt="3">
                {dataMode === 'COINS' && (
                    <Text color="#000000">Top 10 Coins grouped daily and remaining coins grouped by Other</Text>
                )}
            </Box>
        </ChartWrapper>
    )
}