import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Line,
    LineChart
} from 'recharts';
import { useEffect, useState } from 'react';
import { Box, Text, useMediaQuery } from "@chakra-ui/react"
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper from '../../common/chartWrapper';
import {
    CHART_HEIGHT,
} from "../../../constants";
import {
    tooltipFormatter,
    tooltipLabelFormatter,
    xAxisFormatter,
    formatterPercent,

} from '../../../helpers'
import { getTokenHex } from "../../../constants/tokens";
import {
    liquidity_by_coin,
} from "../../../constants/api"

type DailyUniqueUsersByCoin = {
    time: string;
    coin: string;
    daily_unique_users: number;
    percentage_of_total_users: number;
    all: number;
};

type UniqueUserTradeData = {
    time: string;
    daily_unique_users: number;
};

type CumulativeNewUsersData = {
    time: string;
    daily_new_users: number;
    cumulative_new_users: number;
};

type GroupedTradeData = {
    time: Date;
    all: number;
    daily_unique_users: number;
    cumulative_unique_users: number;
    unit: string;
    [key: string]: number | Date | { [key: string]: number } | string | undefined;
}

type TempGroupedTradeData = {
    time: Date;
    coins: { [key: string]: number };
    all: number;
    daily_unique_users: number;
    cumulative_unique_users: number;
    unit: string;
    [key: string]: number | Date | { [key: string]: number } | string | undefined;
}

const REQUESTS = [
    liquidity_by_coin
];

export default function CumulativeUsers() {
    const [isMobile] = useMediaQuery('(max-width: 700px)');

    const [formattedData0, setFormattedData0] = useState<any[]>([])
    const [formattedData1000, setFormattedData1000] = useState<any[]>([])
    const [formattedData3000, setFormattedData3000] = useState<any[]>([])
    const [formattedData10000, setFormattedData10000] = useState<any[]>([])
    const [minMax, setMinMax] = useState<any>()

    const [coinKeys0, setCoinKeys0] = useState<any[]>([])
    const [coinKeys1000, setCoinKeys1000] = useState<any[]>([])
    const [coinKeys3000, setCoinKeys3000] = useState<any[]>([])
    const [coinKeys10000, setCoinKeys10000] = useState<any[]>([])


    const [dataMode, setDataMode] = useState<'0' | '1000' | '3000' | '10000'>('0')

    const [dataLiqudity, loadingLiqudity, errorLiqudity] = useRequest(REQUESTS[0], [], 'chart_data');
    const loading = loadingLiqudity;
    const error = errorLiqudity;

    const controls = {
        toggles: [
            {
                text: "Half Spread",
                event: () => setDataMode('0'),
                active: dataMode === '0',
            },
            {
                text: "$1k",
                event: () => setDataMode('1000'),
                active: dataMode === '1000',
            },
            {
                text: "$3k",
                event: () => setDataMode('3000'),
                active: dataMode === '3000',
            },
            {
                text: "$10k",
                event: () => setDataMode('10000'),
                active: dataMode === '10000',
            }
        ]
    }

    type InputData = {
        [key: string]: {
            median_slippage_0: number,
            median_slippage_1000: number,
            median_slippage_3000: number,
            median_slippage_10000: number,
            time: string
        }[]
    };

    type OutputData = {
        median_slippage_0: { time: Date, [key: string]: number | Date | string }[],
        median_slippage_1000: { time: Date, [key: string]: number | Date | string }[],
        median_slippage_3000: { time: Date, [key: string]: number | Date | string }[],
        median_slippage_10000: { time: Date, [key: string]: number | Date | string }[],
    };

    const transformData = (data: InputData): OutputData => {
        const coinTotals = new Map<string, number>();

        const minMax: { min: number; max: number } = { min: Infinity, max: -Infinity };

        // Compute overall totals for each coin
        for (let key in data) {
            data[key].forEach((record) => {
                coinTotals.set(key, (coinTotals.get(key) || 0) + record.median_slippage_1000 + record.median_slippage_3000 + record.median_slippage_10000);
            });
        }

        // Get the top 10 coins by total over the whole time period
        const topCoins = Array.from(coinTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([coin]) => coin);

        // Filter data for each category by top 10 coins
        const filteredData: InputData = {};
        for (let coin of topCoins) {
            filteredData[coin] = data[coin];
        }

        const median_slippage_0 = new Map<string, { time: Date, [key: string]: number | Date | string }>();
        const median_slippage_1000 = new Map<string, { time: Date, [key: string]: number | Date | string }>();
        const median_slippage_3000 = new Map<string, { time: Date, [key: string]: number | Date | string }>();
        const median_slippage_10000 = new Map<string, { time: Date, [key: string]: number | Date | string }>();

        for (let key in filteredData) {
            filteredData[key].forEach((record) => {
                const { time, median_slippage_0: val_0, median_slippage_1000: val_1000, median_slippage_3000: val_3000, median_slippage_10000: val_10000 } = record;

                const map0 = median_slippage_0.get(time) || { time: new Date(time), unit: "%" };
                const map1000 = median_slippage_1000.get(time) || { time: new Date(time), unit: "%" };
                const map3000 = median_slippage_3000.get(time) || { time: new Date(time), unit: "%" };
                const map10000 = median_slippage_10000.get(time) || { time: new Date(time), unit: "%" };

                map0[key] = val_0 * 100;
                map1000[key] = val_1000 * 100;
                map3000[key] = val_3000 * 100;
                map10000[key] = val_10000 * 100;

                median_slippage_0.set(time, map0);
                median_slippage_1000.set(time, map1000);
                median_slippage_3000.set(time, map3000);
                median_slippage_10000.set(time, map10000);
            });
        }

        return {
            median_slippage_0: Array.from(median_slippage_0.values()),
            median_slippage_1000: Array.from(median_slippage_1000.values()),
            median_slippage_3000: Array.from(median_slippage_3000.values()),
            median_slippage_10000: Array.from(median_slippage_10000.values())
        };
    };

    type MinMaxValues = {
        min: number;
        max: number;
    };

    const getMinMaxValues = (data: any): MinMaxValues => {
        let min = Infinity;
        let max = -Infinity;
        for (let prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                const propData = data[prop];
                propData.forEach((item: any) => {
                    for (let key in item) {
                        if (key !== 'time' && typeof item[key] === 'number') {
                            const value = item[key] as number;
                            min = Math.min(min, value);
                            max = Math.max(max, value);
                        }
                    }
                });
            }
        }
        return { min, max };
    };


    const extractUniqueCoins = (data: OutputData['median_slippage_1000'] | OutputData['median_slippage_10000'] | OutputData['median_slippage_1000']): string[] => {
        const coinSet = new Set<string>();
        data.forEach(record => {
            Object.keys(record).forEach(key => {
                if (key !== 'time' && key !== 'unit') {
                    coinSet.add(key);
                }
            });
        });
        return Array.from(coinSet);
    };

    const formatData = () => {
        const formattedData = transformData(dataLiqudity);
        setFormattedData0(formattedData.median_slippage_0)
        setFormattedData1000(formattedData.median_slippage_1000)
        setFormattedData3000(formattedData.median_slippage_3000)
        setFormattedData10000(formattedData.median_slippage_10000)
        const formattedUniqueCoinKeys0 = extractUniqueCoins(formattedData.median_slippage_0)
        const formattedUniqueCoinKeys1000 = extractUniqueCoins(formattedData.median_slippage_1000)
        const formattedUniqueCoinKeys3000 = extractUniqueCoins(formattedData.median_slippage_3000)
        const formattedUniqueCoinKeys10000 = extractUniqueCoins(formattedData.median_slippage_10000)
        const minMaxValues = getMinMaxValues(formattedData);
        setMinMax(minMaxValues);
        setCoinKeys0(formattedUniqueCoinKeys0)
        setCoinKeys1000(formattedUniqueCoinKeys1000)
        setCoinKeys3000(formattedUniqueCoinKeys3000)
        setCoinKeys10000(formattedUniqueCoinKeys10000)
    };

    useEffect(() => {
        if (!loading && !error) {
            formatData();
        }
    }, [loading])

    const chartData = dataMode === '0' ? formattedData0 : dataMode === '1000' ? formattedData1000 : dataMode === '3000' ? formattedData3000 : formattedData10000;

    const chartDataCoinKeys = dataMode === '0' ? coinKeys0 : dataMode === '1000' ? coinKeys1000 : dataMode === '3000' ? coinKeys3000 : coinKeys10000;

    return (
        <ChartWrapper
            title="Slippage % by Trade Size"
            loading={loading}
            data={chartData}
            controls={controls}
            zIndex={8}
        >
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="15 15" opacity={0.1} />
                    <XAxis
                        dataKey="time"
                        tickFormatter={xAxisFormatter} minTickGap={30}
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        tickMargin={10}
                    />
                    <YAxis
                        domain={minMax ? [minMax.min, minMax.max] : [0, 'auto']}
                        width={45}
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        dx={6}
                        tickFormatter={formatterPercent}
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
                    <Legend wrapperStyle={{ bottom: -5 }} />
                    {
                        chartDataCoinKeys.map(((coinName, i) => {
                            return (
                                <Line
                                    isAnimationActive={false}
                                    type="monotone"
                                    dataKey={`${coinName}`}
                                    name={coinName.toString()}
                                    stroke={getTokenHex(coinName.toString())}
                                    key={i}
                                    dot={false}
                                />
                            )
                        }))
                    }
                </LineChart>
            </ResponsiveContainer>
            <Box w="100%" mt="3">
                <Text color="#000000">Top 10 Coins over time</Text>
            </Box>
        </ChartWrapper>
    )
}