import { type DocumentId, isValidDocumentId } from "@automerge/automerge-repo";
import { LoaderFunction } from "react-router-dom";

export interface LoaderData {
  listId: DocumentId | undefined;
}

const itemsScreenLoader: LoaderFunction = ({ params }): LoaderData => {
  const listId = params.listId;
  if (listId && isValidDocumentId(listId)) {
    return { listId };
  }
  return { listId: undefined };
};

export default itemsScreenLoader;
