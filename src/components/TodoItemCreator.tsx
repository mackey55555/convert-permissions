import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { useTodoList } from "../state/todoListState";

export const TodoItemCreator: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { addListItem } = useTodoList();
  const addItem = useCallback(() => {
    addListItem(inputValue);
    setInputValue("");
  }, [addListItem, inputValue]);
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }) => {
      setInputValue(value);
    },
    []
  );
  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
};
