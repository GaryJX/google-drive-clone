import { Box, Button, FormLabel, IconButton, Input, Progress } from "@chakra-ui/react";
import { db, storage } from "config/firebase";
import { useAuth } from "hooks/useAuth";
import { Folder, ROOT_FOLDER } from "hooks/useFolder";
import { ChangeEvent, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { FaFileUpload } from "react-icons/fa";
import { v4 as uuidV4 } from "uuid";

type AddFileButtonProps = {
	currentFolder: Folder;
};

type FileUploadState = {
	id: string;
	name: string;
	progress: number;
	error: boolean;
};

const AddFileButton: React.FC<AddFileButtonProps> = ({ currentFolder }) => {
	const [uploadingFiles, setUploadingFiles] = useState<FileUploadState[]>([]);
	const { user } = useAuth();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!currentFolder || !file || !user) return;

		const pathArr = currentFolder.path;
		if (currentFolder !== ROOT_FOLDER) {
			pathArr.push(currentFolder);
		}
		const filePath = `${pathArr.map(({ id }) => id).join("/")}/${file.name}`;

		const id = uuidV4();
		setUploadingFiles((prev) => [...prev, { id, name: file.name, progress: 0, error: false }]);

		const uploadTask = storage.ref(`/files/${user.uid}/${filePath}`).put(file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = snapshot.bytesTransferred / snapshot.totalBytes;
				setUploadingFiles((prev) =>
					prev.map((file) => {
						if (file.id === id) {
							return { ...file, progress };
						}
						return file;
					})
				);
			},
			() => {
				// TODO: Error
				setUploadingFiles((prev) =>
					prev.map((file) => {
						if (file.id === id) {
							return { ...file, error: true };
						}
						return file;
					})
				);
			},
			() => {
				// TODO: Completed
				setUploadingFiles((prev) => prev.filter((file) => file.id !== id));
				uploadTask.snapshot.ref.getDownloadURL().then((url) => {
					db.files
						.where("name", "==", file.name)
						.where("userId", "==", user.uid)
						.where("folderId", "==", currentFolder.id)
						.get()
						.then((existingFiles) => {
							const existingFile = existingFiles.docs[0];
							console.log({ existingFile });
							if (existingFile) {
								// Override the file with the same name
								existingFile.ref.update({ url });
							} else {
								db.files.add({
									url,
									name: file.name,
									createdAt: db.getCurrentTimestamp(),
									folderId: currentFolder.id,
									userId: user.uid,
								});
							}
						});
				});
			}
		);
	};
	return (
		<>
			<input
				ref={inputRef}
				type="file"
				onChange={handleUpload}
				style={{ visibility: "hidden", position: "absolute" }}
			/>
			<IconButton onClick={() => inputRef.current?.click()} aria-label="Add New File" icon={<FaFileUpload />} />
			{uploadingFiles.length > 0 &&
				ReactDOM.createPortal(
					<Box position="absolute" bottom="1rem" right="1rem" maxW={250}>
						{uploadingFiles.map((file) => (
							// TODO: Use Toasts for this later
							<Box key={file.id} bgColor="black" color="white" p="1rem">
								{file.name}
								{/* // TODO: Proper Error handling */}
								{file.error && "Has Error"}
								<Progress hasStripe value={file.progress * 100} />
								{`${Math.round(file.progress * 100)}%`}
							</Box>
						))}
					</Box>,
					document.body
				)}
		</>
	);
};

export default AddFileButton;
