import { selectorFamily, useRecoilValue } from "recoil";
import { TodoItemType, useTodoList } from "./todoListState";

type TodoStatsType = {
  totalNum: number;
  totalCompletedNum: number;
  totalUncompletedNum: number;
  percentCompleted: number;
};
const todoListStatsState = selectorFamily<TodoStatsType, TodoItemType[]>({
  key: "todoListStatsState",
  get: (todoList) => () => {
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted =
      totalNum === 0 ? 0 : (totalCompletedNum / totalNum) * 100;
    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted
    };
  }
});
export const useTodoListStats = () => {
  const { todoList } = useTodoList();
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted
  } = useRecoilValue(todoListStatsState(todoList));
  return {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted
  };
};
