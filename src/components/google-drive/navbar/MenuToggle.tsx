import { Box, Icon, IconButton } from "@chakra-ui/react";
import { MdMenu, MdClose } from "react-icons/md";

type MenuToggleProps = {
	toggle: () => void;
	isOpen: boolean;
};

const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => {
	return (
		<Box display={{ base: "block", md: "none" }} onClick={toggle}>
			{isOpen ? (
				<IconButton colorScheme="primary.500" aria-label="Close menu" icon={<MdClose />} />
			) : (
				<IconButton colorScheme="primary.500" aria-label="Close menu" icon={<MdMenu />} />
			)}
		</Box>
	);
};

export default MenuToggle;
