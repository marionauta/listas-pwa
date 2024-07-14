import { useCallback, type FormEvent } from "react";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  TextField,
  Input,
  Form,
  Label,
} from "react-aria-components";
import type { Item } from "../models/Item";

type Props = {
  item: Item;
  editItem: (item: Partial<Item>) => void;
  deleteItem: (id: Item["id"]) => void;
};

function ItemEditor({ item, editItem, deleteItem }: Props) {
  const onSubmit =
    (close: () => void) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = formData.get("name");
      if (typeof name !== "string") return;
      const updated: Partial<Item> = {
        name,
      };
      editItem(updated);
      close();
    };
  const onDelete = useCallback(
    (close: () => void) => () => {
      deleteItem(item.id);
      close();
    },
    [deleteItem, item.id],
  );
  return (
    <Modal>
      <Dialog>
        {({ close }) => (
          <>
            <Form onSubmit={onSubmit(close)}>
              <Heading slot="title">Edit item</Heading>
              <TextField autoFocus defaultValue={item.name}>
                <Label>Name</Label>
                <Input type="text" name="name" />
              </TextField>
              <Button type="submit">Change</Button>
              <Button onPress={close}>Cancel</Button>
            </Form>
            <Button onPress={onDelete(close)}>Delete</Button>
          </>
        )}
      </Dialog>
    </Modal>
  );
}

export default ItemEditor;
