import { FormEvent, useCallback } from "react";
import { Button, Dialog, Form, Input, Modal } from "react-aria-components";
import { useNavigate } from "react-router-dom";

export default function JoinListModal() {
  const navigate = useNavigate();
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const list = data.get("list");
      if (!list || typeof list !== "string") {
        return;
      }
      let id: string | undefined;
      if (list.includes("/")) {
        id = list.split("/").at(-1);
      } else {
        id = list;
      }
      if (id) {
        navigate(`/list/${id}`);
      }
    },
    [navigate],
  );

  return (
    <Modal>
      <Dialog>
        {({ close }) => (
          <Form onSubmit={onSubmit}>
            <Input autoFocus type="text" name="list" placeholder="https://" />
            <Button type="submit">Join</Button>
            <Button onPress={close}>Close</Button>
          </Form>
        )}
      </Dialog>
    </Modal>
  );
}
