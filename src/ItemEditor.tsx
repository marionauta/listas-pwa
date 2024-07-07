import type { FormEvent } from "react";
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
import type { Item } from "./models/Item";

type Props = {
  item: Item;
  saveItem: (item: Item) => void;
};

function ItemEditor({ item, saveItem }: Props) {
  const onSubmit =
    (close: () => void) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = formData.get("name");
      if (typeof name !== "string") return;
      const updated: Item = {
        ...item,
        name,
      };
      saveItem(updated);
      close();
    };

  return (
    <Modal>
      <Dialog>
        {({ close }) => (
          <Form onSubmit={onSubmit(close)}>
            <Heading slot="title">Rename item</Heading>
            <TextField autoFocus defaultValue={item.name}>
              <Label>Name</Label>
              <Input type="text" name="name" />
            </TextField>
            <Button type="submit">Change</Button>
            <Button onPress={close}>Cancel</Button>
          </Form>
        )}
      </Dialog>
    </Modal>
  );
}

export default ItemEditor;
