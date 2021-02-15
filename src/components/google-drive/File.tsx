import { Button, Link } from "@chakra-ui/react";
import { File } from "hooks/useFolder";
import React from "react";
import { FaFile } from "react-icons/fa";

const FileComponent: React.FC<{ file: File }> = ({ file }) => {
	return (
		<Link href={file.url} target="_blank">
			<Button leftIcon={<FaFile />}>{file.name}</Button>
		</Link>
	);
};

export default FileComponent;
