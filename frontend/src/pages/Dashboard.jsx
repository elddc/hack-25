import {Box, Flex, Heading, Icon, Image, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import Button from "../components/Button";
import Main from "../components/Main";
// import {IconPhoneIncoming, IconPhoneOutgoing} from "@tabler/icons-react";

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
            summary: "Jane falls down the stairs and calls for help",
        },
    ]);

    useEffect(() => {
        // todo ping server
        // setCalls([...calls, data]);
    }, []);

    return <Main direction="row">
        <Flex direction="column">
            <Heading size="xl">Call Log</Heading>
            {calls.map(({patient, type, date, time, summary, alerts}, i) =>
                <Flex direction="row" key={i} borderY="1" borderColor="gray.500">
                    <Image src={`${patient}.png`} alt={patient} boxSize="12" objectFit="cover" borderRadius="full"/>
                    <Flex>
                        <Text>{patient}</Text>
                        <Text color="gray.300">{summary}</Text>
                    </Flex>
                    <Flex>
                        {/*{type=="incoming" ? (<IconPhoneIncoming />) : (<IconPhoneOutgoing />)}*/}
                        <Text>{time}</Text>
                    </Flex>
                </Flex>
            )}
        </Flex>
    </Main>;
};

export default <Dashboard />;
