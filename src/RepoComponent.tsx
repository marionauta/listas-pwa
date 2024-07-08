import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { ReactNode } from "react";
import { useRepo } from "./useRepo";

export function RepoComponent({ children }: { children: ReactNode }) {
  const { repo } = useRepo();
  return <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>;
}
