import { db } from "config/firebase";
import { Reducer, useEffect, useReducer } from "react";
import { useAuth } from "./useAuth";

// TODO: Put this in the types folder
export type Folder = {
	name: string;
	id: string | null;
	path: { name: string; id: string | null }[];
};

type FolderReducer = {
	folderId: string | null;
	folder: Folder;
	childFolders: Folder[];
	childFiles: string[];
};

enum Actions {
	SelectFolder,
	UpdateFolder,
	SetChildFolders,
}

export const ROOT_FOLDER: Folder = {
	name: "Root",
	id: null,
	path: [],
};

const reducer: Reducer<FolderReducer, { type: Actions; payload: FolderReducer }> = (state, { type, payload }) => {
	const { folderId, folder, childFolders } = payload;
	switch (type) {
		case Actions.SelectFolder: {
			return {
				folderId,
				folder,
				childFolders: [],
				childFiles: [],
			};
		}
		case Actions.UpdateFolder: {
			return {
				...state,
				folder,
			};
		}
		case Actions.SetChildFolders: {
			return {
				...state,
				childFolders,
			};
		}
		default: {
			return state;
		}
	}
};

const useFolder = (folderId: string | null = null, folder: Folder = ROOT_FOLDER) => {
	const [state, dispatch] = useReducer(reducer, {
		folderId,
		folder,
		childFolders: [],
		childFiles: [],
	});
	const { user } = useAuth();

	useEffect(() => {
		dispatch({ type: Actions.SelectFolder, payload: { folderId, folder, childFolders: [], childFiles: [] } });
	}, [folderId, folder]);

	useEffect(() => {
		if (user) {
			console.log("YES USER!");
			return db.folders
				.where("parentId", "==", folderId)
				.where("userId", "==", user.uid)
				.orderBy("createdAt") // TODO: Uncomment this out when it is done building
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
		if (folderId === null) {
			// Root Folder
			return dispatch({
				type: Actions.UpdateFolder,
				payload: { ...state, folder: ROOT_FOLDER },
			});
		} else {
			db.folders
				.doc(folderId)
				.get()
				.then((doc) => {
					console.log(db.formatDoc(doc));
					dispatch({
						type: Actions.UpdateFolder,
						payload: { ...state, folder: db.formatDoc(doc) },
					});
				})
				.catch((error) => {
					// Default to Root Folder
					console.error(error);
					dispatch({
						type: Actions.UpdateFolder,
						payload: { ...state, folder: ROOT_FOLDER },
					});
				});
		}
	}, [folderId]);

	return state;
};

export default useFolder;
