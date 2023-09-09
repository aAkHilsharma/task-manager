import { useBoardStore } from "@/store/BoardStore";
import { useUpdateModal } from "@/store/UpdateModalStore";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";

import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  id: TypedColumn;
  index: number;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const [setId, setTitle, setDescription, setStatus, setPrevTaskType] =
    useBoardStore((state) => [
      state.setId,
      state.setNewTitleInput,
      state.setNewDescriptionInput,
      state.setNewTaskType,
      state.setPrevTaskType,
    ]);

  const [openModal] = useUpdateModal((state) => [state.openModal]);

  const handleClick = () => {
    setId(todo.$id);
    setTitle(todo.title);
    setDescription(todo.description);
    setStatus(id);
    setPrevTaskType(id);

    openModal();
  };

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className=" flex justify-between items-center bg-white rounded-md space-y-2 drop-shadow-md"
    >
      <div className="flex flex-1 md:flex-col md:items-start justify-between items-center p-5 md:space-y-4">
        <div className="">
          <p className="font-medium text-base">{todo.title}</p>
          <p className="text-gray-500 text-sm font-normal">
            {todo.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClick}
            className="text-gray-500 hover:text-gray-600"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => deleteTask(index, todo, id)}
            className="text-red-500 hover:text-red-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
