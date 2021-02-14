import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import Logo from "./navbar/Logo";
import MenuItems from "./navbar/MenuItems";
import MenuToggle from "./navbar/MenuToggle";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Flex
			as="nav"
			align="center"
			justify="space-between"
			wrap="wrap"
			w="100%"
			mb={8}
			p={8}
			bg={["primary.500", "primary.500", "transparent", "transparent"]}
			color={["white", "white", "primary.700", "primary.700"]}
		>
			<Logo />
			<MenuToggle toggle={() => setIsOpen(!isOpen)} isOpen={isOpen} />
			<MenuItems isOpen={isOpen} />
		</Flex>
	);
};

export default Navbar;
