import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Folder, ROOT_FOLDER } from "hooks/useFolder";
import Link from "next/link";
import React from "react";

type FolderBreadcrumbsProps = {
	currentFolder: Folder;
};

const FolderBreadcrumbs: React.FC<FolderBreadcrumbsProps> = ({ currentFolder }) => {
	console.log({ currentFolder });
	let path = currentFolder === ROOT_FOLDER ? [] : [{ name: ROOT_FOLDER.name, id: ROOT_FOLDER.id }];
	if (currentFolder) path = [...path, ...currentFolder.path];
	console.log({ path });
	return (
		<Breadcrumb>
			{path.map((folder) => (
				<BreadcrumbItem key={folder.id}>
					<Link href={folder.id ? `/folder/${folder.id}` : "/dashboard"}>
						<BreadcrumbLink href="#" isTruncated maxW={150} color="blue">
							{folder.name}
						</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			))}
			{currentFolder && (
				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink isTruncated maxW={250} pointerEvents="none">
						{currentFolder.name}
					</BreadcrumbLink>
				</BreadcrumbItem>
			)}
		</Breadcrumb>
	);
};

export default FolderBreadcrumbs;
