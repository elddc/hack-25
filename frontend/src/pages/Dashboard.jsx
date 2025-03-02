import {Box, Flex, Heading, Icon, Image, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import Button from "../components/Button";
import Main from "../components/Main";
import {IconPhoneIncoming, IconPhoneOutgoing} from "@tabler/icons-react";

import {LineChart} from '@mui/x-charts/LineChart';
import getJournalEntry from "../utils/solana";

const Dashboard = () => {
    const [calls, setCalls] = useState([
        {
            patient: "Jane Doe",
            type: "outgoing",
            date: "Feb 28, 2025",
            time: "1:30pm",
            duration: "2hrs",
            summary: "Jane talks about her family",
        }, {
            patient: "John Doe",
            type: "incoming",
            date: "March 1, 2025",
            time: "4:20pm",
            duration: "2hrs",
            summary: "John talks about his new hobbies",
        }, {
            patient: "Jane Doe",
            type: "incoming",
            date: "March 1, 2025",
            time: "4:20pm",
            duration: "5hrs",
            summary: "Jane is confused about where she is",
        },
    ]);

    /*
    useEffect(() => {
        // todo ping server
        setCalls([...calls, data]);
    }, []);
    */

    const showDetail = () => {
        // todo
        // getJournalEntry("provider", "ownerPubkey", "title");
    }

    return <Main direction="row">
        <Flex direction="column">
            <Heading size="xl" mb="4">Call Log</Heading>
            {calls.map(({patient, summary, time, type, date}, i) => {
                const showDate = (i === 0 || date !== calls[i - 1].date);
                let content = (
                    <Flex as="button" onClick={() => showDetail(i)} direction="row" align="center" key={i}
                          borderTop={!showDate && "1px"} borderColor="gray.500" p="2" gap="4">
                        <Image src={`${patient}.png`} alt={patient} boxSize="12" objectFit="cover"
                               borderRadius="full" />
                        <Flex direction="column" flex="1" mr="10" align="start">
                            <Text fontWeight="bold">{patient}</Text>
                            <Text color="gray.500" fontStyle="italic" fontSize="sm">{summary}</Text>
                        </Flex>
                        <Flex direction="column" align="center">
                            {type === "incoming" ? <IconPhoneIncoming /> : <IconPhoneOutgoing />}
                            <Text fontSize="sm">{time}</Text>
                        </Flex>
                    </Flex>
                );

                if (showDate) {
                    content = (
                        <Flex direction="column" mb="4" key={i}>
                            <Text fontSize="lg" fontWeight="bold">{date}</Text>
                            {content}
                        </Flex>
                    )
                }

                return content;
            })}
        </Flex>
        <Flex>
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },
                ]}
                width={500}
                height={300}
            />
        </Flex>
    </Main>;
};

export default Dashboard;
