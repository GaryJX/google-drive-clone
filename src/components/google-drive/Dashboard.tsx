import Navbar from "components/google-drive/Navbar";
import { Box } from "@chakra-ui/react";
import AddFolderButton from "components/google-drive/AddFolderButton";
import useFolder from "hooks/useFolder";
import FolderComponent from "components/google-drive/Folder";
import { useRouter } from "next/router";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { useEffect } from "react";
import AddFileButton from "./AddFileButton";
import FileComponent from "./File";

const Dashboard = () => {
	const router = useRouter();
	const { id } = router.query;
	const { folder, childFolders, childFiles } = useFolder((id as string) || null);

	useEffect(() => {
		console.log({ childFiles });
	}, [childFiles]);

	return (
		<div>
			<Navbar />
			<Box>
				<Box d="flex" alignItems="center">
					<FolderBreadcrumbs currentFolder={folder} />
					<AddFileButton currentFolder={folder} />
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
				{childFolders.length > 0 && childFiles.length > 0 && <hr />}
				{childFiles.length > 0 && (
					// TODO: Not sure if this div is necessary
					<div>
						{childFiles.map((childFile) => (
							<FileComponent key={childFile.id} file={childFile} />
						))}
					</div>
				)}
			</Box>
		</div>
	);
};

export default Dashboard;
