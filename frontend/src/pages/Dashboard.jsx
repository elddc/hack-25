import {Box, Flex, Heading, Icon, Image, Text} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import Button from "../components/Button";
import Main from "../components/Main";
import {LineChart, Line, Tooltip, YAxis} from 'recharts';
import {IconArrowRight, IconPhoneIncoming, IconPhoneOutgoing} from "@tabler/icons-react";

const emojis = ["😭", "😢", "😞", "😔", "😕", "😐", "🙂", "😊", "😁", "😆", "🤩"];

const Dashboard = () => {
    const [calls, setCalls] = useState([
        {
            patient: "Jane Doe",
            type: "outgoing",
            date: "Feb 28, 2025",
            time: "1:30pm",
            summary: "Jane talks about her family",
            mood: [1, 2, 5, 6, 9, 8]
        }, {
            patient: "John Doe",
            type: "incoming",
            date: "March 1, 2025",
            time: "4:20pm",
            summary: "John talks about his new hobbies",
            mood: [8, 7, 9, 10, 10, 9]
        }, {
            patient: "Jane Doe",
            type: "incoming",
            date: "March 1, 2025",
            time: "4:20pm",
            summary: "Jane is confused about where she is",
            mood: [5, 4, 6, 2, 3]
        },
    ]);
    const [idx, setIdx] = useState(0);

    // useEffect(() => {
    //     // todo ping server
    //     setCalls([...calls, data]);
    // }, []);
    useEffect(() => {
        fetch(`https://localhost:3000/chat`)
            .then(res => {
                setMessages(res.body);
            })
            .catch(error => {
                console.error("Error fetching messages:", error);
            });
    }, []);


    return <Main flexDir="row" gap="12" maxW="none">
        <Flex direction="column">
            <Heading size="xl" mb="4">Call Log</Heading>
            {calls.map(({patient, summary, time, type, date}, i) => {
                const showDate = (i === 0 || date !== calls[i - 1].date);
                let content = (
                    <Flex as="button" onClick={() => setIdx(i)} direction="row" align="center" key={i}
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
        <Flex direction="column" align="end">
            <Text as="h1" fontSize="lg" fontWeight="bold">{calls[idx].patient}'s mood</Text>
            <Text>{calls[idx].date}</Text>
            <LineChart width={300} height={500} data={calls[idx].mood.map((m, i) => ({
                mood: m,
                time: i
            }))}>
                <Line type="monotone" stroke="var(--chakra-colors-blue-400)" dataKey="mood" />
                <YAxis tickFormatter={(value) => emojis[value]} domain={[0, 10]} />
                <Tooltip labelStyle={{"display": "none"}} formatter={(value) => [emojis[value], ""]} cursor={false} separator="" allowEscapeViewBox={{ x: true, y: true }} animationDuration={300} />
            </LineChart>
            <Button as={Link} to="/chat">View logs<IconArrowRight /></Button>
        </Flex>
    </Main>;
};

export default Dashboard;
