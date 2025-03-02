import {Container} from "@chakra-ui/react";
import {useNavigate} from "react-router";
import {ColorModeSwitcher} from "./ColorModeSwitcher";

const Main = ({children, ...props}) => {
    return <Container as="main" flexDir="column" justifyContent="center" centerContent {...props}>
        <ColorModeSwitcher position="fixed" top="2" right="2" />
        {children}
    </Container>;
};

export default Main;
