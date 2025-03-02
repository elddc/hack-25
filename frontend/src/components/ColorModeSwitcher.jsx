import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import {IconMoonFilled, IconSunFilled} from "@tabler/icons-react";
import Button from "./Button";

export const ColorModeSwitcher = props => {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(IconMoonFilled, IconSunFilled);

    return (
        <Button
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            variant="ghost"
            colorScheme="gray"
            onClick={toggleColorMode}
            p="0"
            {...props}
        >
            <SwitchIcon />
        </Button>
    );
};
