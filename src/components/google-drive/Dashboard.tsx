import Navbar from "components/google-drive/Navbar";
import { Box } from "@chakra-ui/react";
import AddFolderButton from "components/google-drive/AddFolderButton";
import useFolder from "hooks/useFolder";
import FolderComponent from "components/google-drive/Folder";
import { useRouter } from "next/router";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { useEffect } from "react";

const Dashboard = () => {
	const router = useRouter();
	const { id } = router.query;
	const { folder, childFolders } = useFolder((id as string) || null);

	useEffect(() => {
		console.log({ folder });
	}, [folder]);

	return (
		<div>
			<Navbar />
			<Box>
				<Box d="flex" alignItems="center" justifyContent="space-between">
					<FolderBreadcrumbs currentFolder={folder} />
					<AddFolderButton currentFolder={folder} />
				</Box>
				{childFolders.length > 0 && (
					// TODO: Not sure if this div is necessary
					<div>
						{childFolders.map((childFolder) => (
							<FolderComponent key={childFolder.id} folder={childFolder} />
						))}
					</div>
				)}
			</Box>
		</div>
	);
};

export default Dashboard;
