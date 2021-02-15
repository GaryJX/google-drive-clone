import {
	Button,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { db } from "config/firebase";
import { useAuth } from "hooks/useAuth";
import { FormEvent, useRef, useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { Folder, ROOT_FOLDER } from "hooks/useFolder";

type AddFolderButtonProps = {
	currentFolder: Folder;
};

const AddFolderButton: React.FC<AddFolderButtonProps> = ({ currentFolder }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [folderName, setFolderName] = useState("");
	const auth = useAuth();
	const initialRef = useRef<HTMLInputElement | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!currentFolder) return;
		if (!auth.user) return;

		const path = [...currentFolder.path];
		if (currentFolder !== ROOT_FOLDER) {
			const { name, id } = currentFolder;
			path.push({ name, id });
		}
		// TODO: Check if there is already a folder with the same name in the parent folder. If so, don't add this one, and notify user
		await db.folders.add({
			name: folderName,
			parentId: currentFolder.id,
			userId: auth.user.uid,
			path,
			createdAt: db.getCurrentTimestamp(),
		});
		setFolderName("");
		onClose();
	};

	return (
		<>
			<IconButton onClick={onOpen} aria-label="Add New Folder" icon={<FaFolderPlus />} />
			<Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add New Folder</ModalHeader>
					<form onSubmit={onSubmit}>
						<ModalBody>
							<FormControl>
								<FormLabel>Folder Name</FormLabel>
								<Input
									ref={initialRef}
									value={folderName}
									onChange={(e) => setFolderName(e.target.value)}
								/>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Button mr={3} type="submit">
								Save
							</Button>
							<Button onClick={onClose}>Close</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddFolderButton;
