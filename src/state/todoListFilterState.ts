import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

export const FilterValue = {
  SHOW_ALL: "Show All",
  SHOW_COMPLETED: "Show Completed",
  SHOW_UNCOMPLETED: "Show Uncompleted"
} as const;
export type FilterType = typeof FilterValue[keyof typeof FilterValue];
const todoListFilterState = atom<FilterType>({
  key: "todoListFilterState",
  default: FilterValue.SHOW_ALL
});
export const useFilter = () => {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  const setListFilter = useCallback(
    (filter: FilterType) => {
      setFilter(filter);
    },
    [setFilter]
  );
  return { filter, setListFilter };
};
