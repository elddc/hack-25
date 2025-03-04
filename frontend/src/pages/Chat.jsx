import {Box, Flex, Text} from "@chakra-ui/react";
import {IconArrowBack, IconArrowLeft, IconArrowUp} from "@tabler/icons-react";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import Button from "../components/Button";
import ChatBubble from "../components/ChatBubble";
import Main from "../components/Main";

const API_URL = "https://271c-173-230-107-49.ngrok-free.app";

const Chat = () => {
    const nav = useNavigate();
    const [metadata, setMetadata] = useState({
        patient: "Jane Doe",
        type: "outgoing",
        date: "Feb 28, 2025",
        time: "1:30pm",
        duration: "2hrs",
        summary: "Jane talks about her family",
    });
    const [messages, setMessages] = useState([
        {
            sender: "system",
            text: "conversation starts at 4:20pm",
        }, {
            sender: "bot",
            text: "Hello I am bot 🤖",
        }, {
            sender: "user",
            text: "Hello I am old lady",
        }, {
            sender: "bot",
            text: "Nice to meet u 😄",
        }, {
            sender: "user",
            text: "Who are you?? 😨",
        }, {
            sender: "bot",
            text: "I am bot 🤖",
        }, {
            sender: "user",
            text: "Hello I am old lady",
        }, {
            sender: "bot",
            text: "Nice to meet u 😄",
        }, {
            sender: "user",
            text: "Who are you?? 😨",
        }, {
            sender: "bot",
            text: "I am bot 🤖",
        }, {
            sender: "user",
            text: "Hello I am old lady",
        }, {
            sender: "bot",
            text: "Nice to meet u 😄",
        }, {
            sender: "user",
            text: "Who are you?? 😨",
        },
    ]);
    const [chatSummary, setChatSummary] = useState("Hello world!");
    const chatRef = useRef();


    // Fetch messages from server
    useEffect(() => {
        axios.get(`http://localhost:3000/messages`)
            .then(response => setMessages(response.data));
    }, []);

    return <Main p="4" display="box">
        <Button onClick={() => nav(-1)} p="0" position="fixed" top="2" left="2" variant="ghost" colorScheme="gray">
            <IconArrowLeft />
        </Button>
        <Text as="h1" position="fixed" top="0" py="2" h="16" bg="var(--chakra-colors-chakra-body-bg)" fontSize="3xl" fontWeight="bold" w="xl">Conversation</Text>
        <Flex direction="column" my="20" pb="20" w="xl">
            {messages.map((msg, i) => <ChatBubble {...msg} key={i} />)}
            <Flex ref={chatRef} h="10" />
        </Flex>
        {/*<Flex width="xl" mt="2" position="fixed" pb="4" bottom="0" bg="var(--chakra-colors-chakra-body-bg)" borderTopRadius="xl">
            <Flex direction="column" bg="gray.200" _dark={{"bg": "gray.500"}} borderColor="gray.500" borderRadius="xl" p="6" w="full">
                Summary: {chatSummary}
            </Flex>
        </Flex>*/}
    </Main>;
};

export default Chat;
