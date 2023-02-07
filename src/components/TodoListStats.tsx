import { FC } from "react";
import { useTodoListStats } from "../state/todoListStatsState";

export const TodoListStats: FC = () => {
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted
  } = useTodoListStats();
  const formattedPercentCompleted = Math.round(percentCompleted);
  return (
    <ul>
      <li>Total items: {totalNum}</li>
      <li>Items completed: {totalCompletedNum}</li>
      <li>Items not completed: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  );
};
