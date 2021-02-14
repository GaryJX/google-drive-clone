import Navbar from "components/google-drive/Navbar";
import { Box } from "@chakra-ui/react";
import AddFolderButton from "components/google-drive/AddFolderButton";

const DashboardPage = () => {
	return (
		<div>
			<Navbar />
			<Box>
				<AddFolderButton />
			</Box>
		</div>
	);
};

export default DashboardPage;
