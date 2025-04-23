import React from 'react';
import { RiLoader5Fill } from 'react-icons/ri';
import { Box, Button, ButtonGroup, Text, Spinner } from '@chakra-ui/react';
//import { Toggle } from '../../../types';

interface Toggle {
    text: string;
    event: () => void;
    active: boolean;
}

const Loader = () => <Box w="100%" position="absolute" top="calc(50% - 10px)" display="flex" justifyContent="center"><Spinner display="flex" w="30px" h="30px" /></Box>

function ChartWrapper(props: any) {
    const {
        title,
        loading,
        csvFields,
        data,
        controls,
        zIndex,
    } = props;

    return (
        <Box display="grid" width={{ xs: '100%', md: '100%' }} mt="3" p={{ xs: '0', md: '0 5 0 0' }}>
            <Box position="relative"
                p={{ xs: '2', md: '4' }}
                bg="#F3E8FF"
                boxShadow="0px 0px 7px rgb(0 0 0 / 20%)"
                borderRadius={{ xs: '0', md: '2xl' }}
                zIndex={zIndex}
            >
                <Box w="100%" mb="2">
                    <Box w="100%" mb="2"
                        display="flex"
                        justifyContent="space-between"
                        flexDirection={{ xs: "column", md: "row" }}
                    >
                        <Text display="flex" w={{ xs: "100%", md: "100%" }} fontSize="1.2rem" fontWeight="600" color="#000000">
                            {title}
                        </Text>
                        <Box w={{ xs: "100%", md: "100%" }} display="flex" justifyContent={{ xs: "flex-start", md: "flex-end" }}
                            mt={controls && controls.toggles && controls.toggles.length && "2"}
                            mb="1rem">
                            <ButtonGroup isAttached={true}>
                                {controls && controls.toggles && controls.toggles.length > 0 && controls.toggles.map((toggle: Toggle, index: number) => {
                                    return (
                                        <Button
                                            key={`toggle-chart-${index}`}
                                            onClick={() => toggle.event()}
                                            variant={toggle.active ? "primary" : "faded"}
                                            size="sm"
                                        >
                                            {toggle.text}
                                        </Button>
                                    )
                                })}
                            </ButtonGroup>
                        </Box>
                    </Box>
                </Box>
                {loading && <Loader />}
                {props.children}
            </Box>
        </Box>
    );
}

export default ChartWrapper;