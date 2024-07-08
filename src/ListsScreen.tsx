import { useCallback, useEffect, useState } from "react";
import { Button, DialogTrigger, Header, Heading } from "react-aria-components";
import { Link } from "react-router-dom";
import { type DocumentId, isValidDocumentId } from "@automerge/automerge-repo";
import ListCreatorDialog from "./ListCreatorDialog";

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

export default function ListsScreen() {
  const { listIds: lists } = useListsReader();

  return (
    <>
      <Header className="toolbar">
        <Heading level={1}>Lists</Heading>
        <DialogTrigger>
          <Button>Create</Button>
          <ListCreatorDialog />
        </DialogTrigger>
        <Button>Join</Button>
      </Header>
      {lists.map((list) => (
        <Link key={list} to={`/list/${list}`}>
          <div className="row">{list}</div>
        </Link>
      ))}
    </>
  );
}
