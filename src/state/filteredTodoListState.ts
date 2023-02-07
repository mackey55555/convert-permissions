import { selectorFamily, useRecoilValue } from "recoil";
import { FilterType, FilterValue, useFilter } from "./todoListFilterState";
import { TodoItemType, useTodoList } from "./todoListState";

type ItemListWithFilter = {
  filter: FilterType;
  list: TodoItemType[];
};
const filteredTodoListState = selectorFamily<
  TodoItemType[],
  ItemListWithFilter
>({
  key: "filteredTodoListState",
  get: ({ filter, list }) => () => {
    switch (filter) {
      case FilterValue.SHOW_COMPLETED:
        return list.filter((item) => item.isComplete);
      case FilterValue.SHOW_UNCOMPLETED:
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  }
});
export const useFilteredTodoList = () => {
  const { filter } = useFilter();
  const { todoList: list } = useTodoList();
  const filteredTodoList = useRecoilValue(
    filteredTodoListState({ filter, list })
  );
  return filteredTodoList;
};
