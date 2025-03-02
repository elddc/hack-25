import {Box, Flex, Image} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const ChatBubble = ({text, sender}) => {
    const [style, setStyle] = useState(null);
    useEffect(() => {
        setStyle(msgStyles(sender));
    }, [sender]);

	return (
        <Flex direction="row" alignItems="end" w="full">
            <Box mt="4" {...style}>{text}</Box>
        </Flex>
    )
};

const msgStyles = (sender) => {
    const sharedBubbleStyles = {
        "px": 3,
        "py": 2,
        "borderRadius": "1.5em",
        "maxW": "60%",
        "color": "#1a202c" // dark mode bg color
    }
    const systemStyles = {
        // "fontStyle": "italic",
        "mx": "auto",
        "my": "4",
        "color": "gray.500"
    }

    switch (sender) {
        case "system":
            return systemStyles
        case "error":
            return {
                ...systemStyles,
                "color": "red.600",
            }
        case "user":
            return {
                ...sharedBubbleStyles,
                "ml": "auto",
                "bg": "gray.300",
                "borderBottomRightRadius": 0,
            }
        default: // bot sender
            return {
                ...sharedBubbleStyles,
                "mr": "auto",
                "bg": "blue.200",
                "borderBottomLeftRadius": 0,
            }
    }
}

export default ChatBubble;
