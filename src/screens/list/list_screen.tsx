import { FormEvent, useCallback } from "react";
import { Button, Input, Form, Heading } from "react-aria-components";
import { Link } from "react-router-dom";
import ItemsRows, { EmptyItems } from "./items_rows";
import type { Item, ItemChangePayload } from "../../models/Item";
import Spacer from "../../components/spacer";
import { useList } from "./list_screen_hooks";
import ListShareButton from "./list_share_button";

export default function ListScreen() {
  const { list, listId, dispatch } = useList();

  const onCreateItem = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const itemName = data.get("item-name");
      if (itemName && typeof itemName === "string") {
        dispatch({ action: "create-item", payload: { name: itemName } });
        form.reset();
        const inputs = form.getElementsByTagName("input");
        (inputs[0] as HTMLInputElement).focus();
      }
    },
    [dispatch],
  );

  const updateItem = useCallback(
    (item: ItemChangePayload) => {
      dispatch({ action: "update-item", payload: item });
    },
    [dispatch],
  );

  const deleteCompleted = useCallback(() => {
    dispatch({ action: "delete-completed-items" });
  }, [dispatch]);

  const toggleItem = useCallback(
    (item: Pick<Item, "id" | "completedAt">) => () =>
      updateItem({
        id: item.id,
        completedAt: item.completedAt === null ? new Date() : null,
      }),
    [updateItem],
  );

  const deleteItem = useCallback(
    (id: Item["id"]) => dispatch({ action: "delete-item", payload: { id } }),
    [dispatch],
  );

  const isFormDisabled = !listId || !list;

  return (
    <>
      <div className="toolbar">
        <Link to="/" className="button">
          X
        </Link>
        <Heading level={1}>{list?.name ?? "List"}</Heading>
        <Spacer />
        <ListShareButton title={list?.name} />
      </div>
      <Form className="toolbar" onSubmit={onCreateItem}>
        <Input type="text" name="item-name" required />
        <Button type="submit" isDisabled={isFormDisabled}>
          Add
        </Button>
        <Button onPress={deleteCompleted} isDisabled={isFormDisabled}>
          Delete completed
        </Button>
      </Form>
      {!listId ? (
        <EmptyItems placeholder="Invalid list ID." />
      ) : !list ? (
        <EmptyItems placeholder="Retrieving list..." />
      ) : (
        <ItemsRows
          items={list.items}
          toggleItem={toggleItem}
          editItem={updateItem}
          deleteItem={deleteItem}
        />
      )}
    </>
  );
}
