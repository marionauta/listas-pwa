import { useRepo } from "@automerge/automerge-repo-react-hooks";
import { type FormEvent, useCallback } from "react";
import {
  Button,
  Dialog,
  Form,
  Input,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
import type { ItemList } from "./models/List";
import { useNavigate } from "react-router-dom";

export default function ListCreatorDialog() {
  const repo = useRepo();
  const navigate = useNavigate();
  const createItemList = useCallback(
    (name: string) => {
      const handle = repo.create<ItemList>({
        name,
        items: [],
      });
      return handle.documentId;
    },
    [repo],
  );
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      if (name && typeof name === "string") {
        const listId = createItemList(name);
        navigate(`/list/${listId}`);
      }
    },
    [navigate, createItemList],
  );
  return (
    <Modal>
      <Dialog>
        {({ close }) => (
          <Form onSubmit={onSubmit}>
            <Button onPress={close}>X</Button>
            <TextField autoFocus>
              <Label>Name</Label>
              <br />
              <Input type="text" name="name" />
            </TextField>
            <Button type="submit">Add</Button>
          </Form>
        )}
      </Dialog>
    </Modal>
  );
}
