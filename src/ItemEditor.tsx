import { useCallback } from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  TextField,
  Input,
} from "react-aria-components";
import { Item } from "./models/Item";

type Props = {
  item: Item;
  saveItem: (item: Item) => void;
  // close: () => void;
};

const ItemEditor = ({ item, saveItem }: Props) => {
  const [name, setName] = useState(item.name);

  const onChangeName = useCallback(
    (event: any) => {
      setName(event.target.value);
    },
    [setName],
  );
  const onSaveItem = useCallback(() => {
    if (item === undefined || name === undefined) return;
    const updated = {
      ...item,
      name,
    };
    saveItem(updated);
  }, [name]);

  return (
    <Modal>
      <Dialog>
        {({ close }) => (
          <form>
            <Heading slot="title">Rename item</Heading>
            <TextField autoFocus>
              <Input type="text" value={name} onChange={onChangeName} />
            </TextField>
            <Button onPress={onSaveItem}>Change</Button>
            <Button onPress={close}>Cancel</Button>
          </form>
        )}
      </Dialog>
    </Modal>
  );
};

export default ItemEditor;
