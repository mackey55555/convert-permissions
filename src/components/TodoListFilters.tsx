import { ChangeEventHandler, FC, useCallback } from "react";
import {
  FilterType,
  FilterValue,
  useFilter
} from "../state/todoListFilterState";

export const TodoListFilters: FC = () => {
  const { filter, setListFilter } = useFilter();
  const updateFilter: ChangeEventHandler<HTMLSelectElement> = useCallback(
    ({ target: { value } }) => {
      setListFilter(value as FilterType);
    },
    [setListFilter]
  );
  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value={FilterValue.SHOW_ALL}>All</option>
        <option value={FilterValue.SHOW_COMPLETED}>Completed</option>
        <option value={FilterValue.SHOW_UNCOMPLETED}>Uncompleted</option>
      </select>
    </>
  );
};
