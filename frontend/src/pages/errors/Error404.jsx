import {IconArrowLeft} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import Button from "../../components/Button";
import ErrorTemplate from "./ErrorTemplate";

const Error404 = () => {
    const nav = useNavigate();

    return <ErrorTemplate code="404">
        Page not found.
        <Button onClick={() => nav(-1)} variant="ghost" size="sm" gap="2" mt="4">
            <IconArrowLeft />
            Go back?
        </Button>
    </ErrorTemplate>;
};

export default Error404;
