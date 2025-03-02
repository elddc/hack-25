import {Button as ChakraButton, useToken} from "@chakra-ui/react";

const Button = (props) => {
    return <ChakraButton colorScheme="blue" focusBorderColor={`${props.colorScheme}.400`} _focusVisible={{
        boxShadow: `0 0 0 4px var(--chakra-colors-${props.colorScheme}-300)`,
    }} {...props}/>;
};

export default Button;
