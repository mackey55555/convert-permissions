import { ChangeEventHandler, FC, useCallback, useMemo } from "react";
import { TodoItemType, useTodoList } from "../state/todoListState";

type Props = {
  item: TodoItemType;
};
export const TodoItem: FC<Props> = ({ item }) => {
  const {
    deleteItemAtIndex,
    editItemTextAtIndex,
    todoList,
    toggleItemCompletionAtIndex
  } = useTodoList();
  const index = useMemo(
    () => todoList.findIndex((listItem) => listItem === item),
    [item, todoList]
  );
  const editItemText: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }) => {
      editItemTextAtIndex(index, item, value);
    },
    [editItemTextAtIndex, index, item]
  );
  const toggleItemCompletion = useCallback(() => {
    toggleItemCompletionAtIndex(index, item);
  }, [index, item, toggleItemCompletionAtIndex]);
  const deleteItem = useCallback(() => {
    deleteItemAtIndex(index);
  }, [deleteItemAtIndex, index]);
  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
};
