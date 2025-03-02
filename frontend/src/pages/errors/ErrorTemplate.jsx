import {Heading} from "@chakra-ui/react";
import Main from "../../components/Main";

export const ErrorTemplate = ({code, children}) => {
    return <Main>
        <Heading size="4xl">{code}</Heading>
        {children}
    </Main>;
};

export default ErrorTemplate;
