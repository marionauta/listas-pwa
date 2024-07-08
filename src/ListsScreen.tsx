import { useCallback, useEffect, useState } from "react";
import { Header, Heading } from "react-aria-components";
import { List } from "./models/List";
import { Link } from "react-router-dom";
import { DocumentId, isValidDocumentId } from "@automerge/automerge-repo";

function useListsReader() {
  const [listIds, setListIds] = useState<DocumentId[]>([]);
  useEffect(() => {
    async function someting() {
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
        const keys = allRequest.result as [string, string, string];
        const keySet = new Set<DocumentId>();
        for (const key of keys) {
          if (isValidDocumentId(key[0])) {
            keySet.add(key[0]);
          }
        }
        console.warn(keySet);
        setListIds(Array.from(keySet));
      };
    }
    someting().catch(console.error);
  }, [setListIds]);
  return [listIds];
}

export default function ListsScreen() {
  const [lists] = useListsReader();

  return (
    <>
      <Header className="toolbar">
        <Heading level={1}>Lists</Heading>
      </Header>
      {lists.map((list) => (
        <Link to={`/list/${list}`}>
          <div className="row" key={list}>
            {list}
          </div>
        </Link>
      ))}
    </>
  );
}
