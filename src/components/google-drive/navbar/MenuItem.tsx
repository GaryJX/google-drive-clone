import { Text } from "@chakra-ui/react";
import Link from "next/link";

type MenuItemProps = {
	to: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ children, to }) => {
	return (
		<Link href={to}>
			<a>
				<Text display="block">{children}</Text>
			</a>
		</Link>
	);
};

export default MenuItem;
