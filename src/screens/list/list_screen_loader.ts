import {
  type DocumentId,
  isValidDocumentId,
} from "@automerge/automerge-repo/slim";
import type { LoaderFunction } from "react-router-dom";

export interface LoaderData {
  listId: DocumentId | undefined;
}

const listScreenLoader: LoaderFunction = ({ params }): LoaderData => {
  const listId = params.listId;
  if (listId && isValidDocumentId(listId)) {
    return { listId };
  }
  return { listId: undefined };
};

export default listScreenLoader;
