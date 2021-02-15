import { Button } from "@chakra-ui/react";
import { Folder } from "hooks/useFolder";
import Link from "next/link";
import React from "react";
import { FaFolder } from "react-icons/fa";

const FolderComponent: React.FC<{ folder: Folder }> = ({ folder }) => {
	return (
		<Link href={folder.id ? `/folder/${folder.id}` : "/dashboard"}>
			<Button leftIcon={<FaFolder />}>{folder.name}</Button>
		</Link>
	);
};

export default FolderComponent;
