import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Line
} from 'recharts';
import { useEffect, useState } from 'react';
import { Box, Text, useMediaQuery } from "@chakra-ui/react"
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
    tooltipFormatterCurrency,
    tooltipLabelFormatter,
    yaxisFormatter,
    xAxisFormatter,
} from '../../../helpers'
import { getTokenHex } from "../../../constants/tokens";
import {
    cumulative_usd_volume,
    daily_usd_volume,
    daily_usd_volume_by_coin,
    daily_usd_volume_by_crossed,
    daily_usd_volume_by_user,
} from "../../../constants/api"

const REQUESTS = [
    cumulative_usd_volume,
    daily_usd_volume,
    daily_usd_volume_by_coin,
    daily_usd_volume_by_crossed,
    daily_usd_volume_by_user,
];

export default function VolumeChart() {
    const [isMobile] = useMediaQuery('(max-width: 700px)');
    const [dataMode, setDataMode] = useState<"COINS" | "MARGIN">('COINS');
    const [formattedDataCoins, setFormattedDataCoins] = useState<any[]>([])
    const [formattedDataMarin, setFormattedDataMarin] = useState<any[]>([])
    const [formattedCumulativeVolumeData, setFormattedCumulativeVolumeData] = useState<any[]>([]);
    const [coinKeys, setCoinKeys] = useState<any[]>([])
    const [dataCumulativeUsdVolume, loadingCumulativeUsdVolume, errorCumulativeUsdVolume] = useRequest(REQUESTS[0], [], 'chart_data');
    const [dataDailyUsdVolume, loadingDailyUsdVolume, errorDailyUsdVolume] = useRequest(REQUESTS[1], [], 'chart_data');
    const [dataDailyUsdVolumeByCoin, loadingDailyUsdVolumeByCoin, errorDailyUsdVolumeByCoin] = useRequest(REQUESTS[2], [], 'chart_data');
    const [dataDailyUsdVolumeByCrossed, loadingDailyUsdVolumeByCrossed, errorDailyUsdVolumeByCrossed] = useRequest(REQUESTS[3], [], 'chart_data');
    const [dataDailyUsdVolumeByUser, loadingDailyUsdVolumeByUser, errorDailyUsdVolumeByUser] = useRequest(REQUESTS[4], [], 'chart_data');

    const loading = loadingCumulativeUsdVolume || loadingDailyUsdVolume || loadingDailyUsdVolumeByCoin || loadingDailyUsdVolumeByCrossed || loadingDailyUsdVolumeByUser;

    const error = errorCumulativeUsdVolume || errorDailyUsdVolume || errorDailyUsdVolumeByCoin || errorDailyUsdVolumeByCrossed || errorDailyUsdVolumeByUser;

    type CumulativeVolumeData = { cumulative: number, time: string };

    const formatCumulativeVolumeByTime = (dataCumulativeUsdVolume: CumulativeVolumeData[]): { [key: string]: number } => {
        const result: { [key: string]: number } = {};
        for (const data of dataCumulativeUsdVolume) {
            result[data.time] = data.cumulative;
        }
        return result;
    };

    type FormattedDailyVolumeData = { time: string, daily_usd_volume: number };

    const formatDailyVolumeByTime = (dataCumulativeUsdVolume: FormattedDailyVolumeData[]): { [key: string]: number } => {
        const result: { [key: string]: number } = {};
        for (const data of dataCumulativeUsdVolume) {
            result[data.time] = data.daily_usd_volume;
        }
        return result;
    };

    type VolumeData = { coin: string, daily_usd_volume: number, time: string };
    type FormattedVolumeData = any[] //{ time: string, all: number, [coin: string]: number };

    const formatVolumeByCoins = (
        dataDailyUsdVolumeByCoin: VolumeData[],
        formattedCumulativeUsdVolume: { [key: string]: number },
        formattedDailyVolumeByTime: { [key: string]: number }
    ): FormattedVolumeData[] => {
        const temp: { [key: string]: { all: number, [coin: string]: number } } = {};
        for (const data of dataDailyUsdVolumeByCoin) {
            if (!temp[data.time]) {
                temp[data.time] = { all: 0 };
            }
            temp[data.time][data.coin] = data.daily_usd_volume;
            temp[data.time].all += data.daily_usd_volume;
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
                cumulative: formattedCumulativeUsdVolume[time as any],
                all: formattedDailyVolumeByTime[time as any],
                unit: "$",
            };
        });

        return result;
    };


    const extractUniqueCoins = (formattedVolumeData: FormattedVolumeData[]): string[] => {
        const coinSet = new Set<string>();
        for (const data of formattedVolumeData) {
            Object.keys(data).forEach(coin => {
                if (coin !== 'all' &&
                    coin !== 'cumulative' &&
                    coin !== 'time' &&
                    coin !== 'other' &&
                    coin !== 'unit'
                ) {
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

    type VolumeCrossedData = { crossed: boolean, daily_usd_volume: number, time: string }

    const formatVolumeByCrossed = (
        dataDailyUsdVolumeByCrossed: VolumeCrossedData[],
        formattedCumulativeUsdVolume: { [key: string]: number },
        formattedDailyVolumeByTime: { [key: string]: number }
    ): any[] => {
        // Create a temporary object to collect the data
        const temp: { [key: string]: any } = {};

        for (const data of dataDailyUsdVolumeByCrossed) {
            if (!temp[data.time]) {
                temp[data.time] = { all: 0, maker: 0, taker: 0 };
            }
            // Assigning daily_usd_volume to 'maker' if crossed is true, else assign to 'taker'
            if (data.crossed) {
                temp[data.time].taker = data.daily_usd_volume;
            } else {
                temp[data.time].maker = data.daily_usd_volume;
            }
            temp[data.time].all += data.daily_usd_volume;
        }
        // Convert the collected data into an array
        const result: any[] = Object.entries(temp).map((item: any) => {
            return {
                time: new Date(item[0]),
                maker: item[1].maker || 0,
                taker: item[1].taker || 0,
                cumulative: formattedCumulativeUsdVolume[item[0]],
                all: formattedDailyVolumeByTime[item[0]],
                unit: "$",
            };
        });
        return result;
    };

    const formatData = () => {
        const formattedCumulativeVolumeByTime = formatCumulativeVolumeByTime(dataCumulativeUsdVolume)
        const formattedDailyVolumeByTime = formatDailyVolumeByTime(dataDailyUsdVolume)
        const formattedVolumeByCoins = formatVolumeByCoins(dataDailyUsdVolumeByCoin, formattedCumulativeVolumeByTime, formattedDailyVolumeByTime);
        const formattedVolumeByCrossed = formatVolumeByCrossed(dataDailyUsdVolumeByCrossed, formattedCumulativeVolumeByTime, formattedDailyVolumeByTime);
        setCoinKeys(extractUniqueCoins(formattedVolumeByCoins))
        setFormattedDataCoins(formattedVolumeByCoins);
        setFormattedDataMarin(formattedVolumeByCrossed)
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
        if (!loading) {
            formatData();
        }
    }, [loading])

    return (
        <ChartWrapper
            title="Cumulative Total non-HLP USD Volume"
            loading={loading}
            data={dataMode === 'COINS' ? formattedDataCoins : formattedDataMarin}
            zIndex={9}
            controls={controls}
        >
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <ComposedChart data={dataMode === 'COINS' ? formattedDataCoins : formattedDataMarin} syncId="syncA">
                    <CartesianGrid strokeDasharray="15 15" opacity={0.1} />
                    <XAxis
                        dataKey="time"
                        tickFormatter={xAxisFormatter}
                        minTickGap={30}
                        tick={{ fill: '#000000', fontSize: isMobile ? 14 : 15 }}
                        tickMargin={10}
                    />
                    <YAxis
                        dataKey="all"
                        interval="preserveStartEnd"
                        tickCount={7}
                        tickFormatter={yaxisFormatter}
                        width={YAXIS_WIDTH}
                        tick={{ fill: '#000000', fontSize: isMobile ? 14 : 15 }}
                    />
                    <YAxis dataKey="cumulative" orientation="right" yAxisId="right"
                        tickFormatter={yaxisFormatter}
                        width={YAXIS_WIDTH}
                        tick={{ fill: '#000000', fontSize: isMobile ? 14 : 15 }}
                    />
                    <Tooltip
                        formatter={tooltipFormatterCurrency}
                        labelFormatter={tooltipLabelFormatter}
                        contentStyle={{
                            textAlign: 'left',
                            background: "#F3E8FF",
                            borderColor: "#E9D5FF",
                            boxShadow: "0px 0px 7px rgb(0 0 0 / 20%)",
                            borderRadius: "26px",
                            color: "#000000",
                        }}
                        itemSorter={(item) => {
                            return Number(item.value) * -1;
                        }}
                    />
                    <Legend wrapperStyle={{ bottom: -5 }} />
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
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dot={false}
                        strokeWidth={1}
                        stroke={BRIGHT_GREEN}
                        dataKey="cumulative"
                        yAxisId="right"
                        opacity={0.7}
                        name="Cumulative"
                    />
                </ComposedChart>
            </ResponsiveContainer>
            <Box w="100%" mt="3" >
                {dataMode === 'COINS' && (
                    <Text color="#000000">Top 10 Coins grouped daily and remaining coins grouped by Other</Text>
                )}
            </Box>
        </ChartWrapper>
    )
}