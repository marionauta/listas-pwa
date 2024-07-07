import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { useRepo } from "./useRepo";
import { ReactNode, useEffect } from "react";

export function RepoComponent({ children }: { children: ReactNode }) {
  const { repo, createItemList } = useRepo();

  useEffect(() => {
    // const id = createItemList("mario");
    // console.warn({ id });
  }, []);

  return <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>;
}
