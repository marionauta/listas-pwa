import { useCallback, useEffect, useState } from "react";
import { Button, DialogTrigger, Header, Heading } from "react-aria-components";
import { Link } from "react-router-dom";
import {
  type DocumentId,
  isValidDocumentId,
} from "@automerge/automerge-repo/slim";
import ListCreatorDialog from "./ListCreatorDialog";
import JoinListModal from "./JoinListModal";
import { useRepo } from "@automerge/automerge-repo-react-hooks";
import type { ItemList } from "../../models/List";
import Spacer from "../../components/spacer";

function useListsReader() {
  const [listIds, setListIds] = useState<DocumentId[]>([]);
  const reloadListIds = useCallback(async () => {
    const db: IDBDatabase = await new Promise((resolve, reject) => {
      const openRequest = window.indexedDB.open("automerge", 1);
      openRequest.onerror = function () {
        reject(openRequest.error);
      };
      openRequest.onupgradeneeded = function (event) {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore("documents");
      };
      openRequest.onsuccess = function () {
        const db = openRequest.result;
        resolve(db);
      };
    });
    const transaction = db.transaction("documents");
    const store = transaction.objectStore("documents");
    const allRequest = store.getAllKeys();
    allRequest.onsuccess = function () {
      const keys = allRequest.result as [string, string, string][];
      const keySet = new Set<DocumentId>();
      for (const key of keys) {
        if (isValidDocumentId(key[0])) {
          keySet.add(key[0]);
        }
      }
      setListIds(Array.from(keySet));
    };
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = function () {
        resolve();
      };
      transaction.onerror = function () {
        reject(transaction.error);
      };
    });
  }, [setListIds]);
  useEffect(() => {
    reloadListIds().catch(console.error);
  }, [reloadListIds]);
  return { listIds, reloadListIds };
}

function useListsNames(listIds: DocumentId[]) {
  const repo = useRepo();
  const [lists, setLists] = useState<{ id: DocumentId; name: string }[]>([]);
  const readListNames = useCallback(
    async (listIds: DocumentId[]) => {
      const lists: { id: DocumentId; name: string }[] = [];
      for (const listId of listIds) {
        const handle = repo.find<ItemList>(listId);
        const doc = await handle.doc();
        if (!doc) {
          continue;
        }
        lists.push({ id: handle.documentId, name: doc.name || "???" });
      }
      setLists(lists);
    },
    [repo],
  );
  useEffect(() => {
    readListNames(listIds).catch(console.error);
  }, [listIds, readListNames]);
  return lists;
}

export default function ListsScreen() {
  const { listIds } = useListsReader();
  const lists = useListsNames(listIds);

  return (
    <>
      <Header className="toolbar">
        <Heading level={1}>Lists</Heading>
        <Spacer />
        <DialogTrigger>
          <Button>Create</Button>
          <ListCreatorDialog />
        </DialogTrigger>
        <DialogTrigger>
          <Button>Join</Button>
          <JoinListModal />
        </DialogTrigger>
      </Header>
      <div className="list-container">
        <div className="list-content">
          {lists.map((list) => (
            <Link key={list.id} to={`/list/${list.id}`}>
              <div className="row">
                <span>{list.name}</span>
                <span style={{ color: "#aaa", fontSize: "0.8em" }}>
                  #{list.id}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
