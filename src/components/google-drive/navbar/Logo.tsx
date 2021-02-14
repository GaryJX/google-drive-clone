import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";

const Logo = () => {
	return (
		<Box w="100px" color={["white", "white", "primary.500", "primary.500"]}>
			<Link href="/">
				<Text as="a" href="/" fontSize="lg" fontWeight="bold">
					Gary Drive
				</Text>
			</Link>
		</Box>
	);
};

export default Logo;
