import { db } from "config/firebase";
import { useRouter } from "next/router";
import { Reducer, useEffect, useReducer } from "react";
import { useAuth } from "./useAuth";

// TODO: Put Folder and File types in a new types folder
export type Folder = {
	id: string | null;
	name: string;
	path: { name: string; id: string | null }[];
	parentId: string | null;
	userId?: string;
	createdAt?: unknown;
};

export type File = {
	id: string;
	name: string;
	url: string;
	folderId: string | null;
	userId?: string;
	createdAt?: unknown;
};

type FolderReducer = {
	folderId: string | null;
	folder: Folder;
	childFolders: Folder[];
	childFiles: File[];
};

enum Actions {
	UpdateFolder,
	SetChildFolders,
	SetChildFiles,
}

export const ROOT_FOLDER: Folder = {
	id: null,
	name: "Root",
	path: [],
	parentId: null,
};

const reducer: Reducer<FolderReducer, { type: Actions; payload: FolderReducer }> = (state, { type, payload }) => {
	const { folderId, folder, childFolders, childFiles } = payload;
	switch (type) {
		case Actions.UpdateFolder: {
			return {
				...state,
				folderId,
				folder,
			};
		}
		case Actions.SetChildFolders: {
			return {
				...state,
				childFolders,
			};
		}
		case Actions.SetChildFiles: {
			return {
				...state,
				childFiles,
			};
		}
		default: {
			return state;
		}
	}
};

const useFolder = (folderId: string | null = null) => {
	const [state, dispatch] = useReducer(reducer, {
		folderId,
		folder: ROOT_FOLDER,
		childFolders: [],
		childFiles: [],
	});
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (folderId === null) {
			// Root Folder
			return dispatch({
				type: Actions.UpdateFolder,
				payload: { ...state, folderId, folder: ROOT_FOLDER },
			});
		} else {
			db.folders
				.doc(folderId)
				.get()
				.then((doc) => {
					dispatch({
						type: Actions.UpdateFolder,
						payload: { ...state, folderId, folder: db.formatDoc(doc) },
					});
				})
				.catch((error) => {
					// Default to Root Folder
					console.error(error);
					router.push("/dashboard");
					dispatch({
						type: Actions.UpdateFolder,
						payload: { ...state, folderId: null, folder: ROOT_FOLDER },
					});
				});
		}
	}, [folderId]);

	useEffect(() => {
		if (user) {
			return db.folders
				.where("parentId", "==", folderId)
				.where("userId", "==", user.uid)
				.orderBy("createdAt")
				.onSnapshot((snapshot) => {
					dispatch({
						type: Actions.SetChildFolders,
						payload: {
							...state,
							childFolders: snapshot.docs.map(db.formatDoc),
						},
					});
				});
		}
	}, [folderId, user]);

	useEffect(() => {
		if (user) {
			return db.files
				.where("folderId", "==", folderId)
				.where("userId", "==", user.uid)
				.orderBy("createdAt")
				.onSnapshot((snapshot) => {
					dispatch({
						type: Actions.SetChildFiles,
						payload: {
							...state,
							childFiles: snapshot.docs.map(db.formatDoc),
						},
					});
				});
		}
	}, [folderId, user]);

	return state;
};

export default useFolder;
