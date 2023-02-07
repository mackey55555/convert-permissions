import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

export type TodoItemType = {
  id: number;
  text: string;
  isComplete: boolean;
};
const todoListState = atom<TodoItemType[]>({
  key: "todoListState",
  default: []
});
let id = 0;
function getId() {
  return id++;
}
function replaceItemAtIndex(
  arr: TodoItemType[],
  index: number,
  newValue: TodoItemType
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}
function removeItemAtIndex(arr: TodoItemType[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
export const useTodoList = () => {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const addListItem = useCallback(
    (text: string) => {
      setTodoList((oldTodoList) => [
        ...oldTodoList,
        {
          id: getId(),
          text,
          isComplete: false
        }
      ]);
    },
    [setTodoList]
  );
  const editItemTextAtIndex = useCallback(
    (index: number, item: TodoItemType, text: string) => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item,
        text
      });
      setTodoList(newList);
    },
    [setTodoList, todoList]
  );
  const toggleItemCompletionAtIndex = useCallback(
    (index: number, item: TodoItemType) => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item,
        isComplete: !item.isComplete
      });
      setTodoList(newList);
    },
    [setTodoList, todoList]
  );
  const deleteItemAtIndex = useCallback(
    (index: number) => {
      const newList = removeItemAtIndex(todoList, index);
      setTodoList(newList);
    },
    [setTodoList, todoList]
  );
  return {
    addListItem,
    deleteItemAtIndex,
    editItemTextAtIndex,
    todoList,
    toggleItemCompletionAtIndex
  };
};
