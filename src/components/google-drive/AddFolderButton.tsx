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
import { FormEvent, useRef, useState } from "react";
import { FaFolderPlus } from "react-icons/fa";

const AddFolderButton = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [folderName, setFolderName] = useState("");
	const initialRef = useRef<HTMLInputElement | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await db.folders.add({ name: folderName });
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
