import {Image, Flex} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const Loading = ({size}) => {
	const [height, setHeight] = useState("50px");
	useEffect(() => {
		console.log(height);
	    switch (size) {
			case "sm":
				setHeight("1.3em");
				break;
			case "lg":
				setHeight("80px");
				break;
			default:
				setHeight("50px");
		}
	}, [size]);

	return <Flex direction="row" gap="0" h={height}>
		TODO
	</Flex>;
};

export default Loading;
