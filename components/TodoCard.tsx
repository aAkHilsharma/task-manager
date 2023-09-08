import { useBoardStore } from "@/store/BoardStore";
import { useUpdateModal } from "@/store/UpdateModalStore";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/solid";

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
      <div className="flex flex-col p-5">
        <p className="text-lg font-medium">{todo.title}</p>
        <p className="text-gray-500 text-sm font-normal">{todo.description}</p>
      </div>
      <button
        onClick={() => deleteTask(index, todo, id)}
        className="text-red-500 hover:text-red-600"
      >
        <XCircleIcon className="h-8 w-8 mr-4" />
      </button>
      <button
        onClick={handleClick}
        className="text-green-500 hover:text-green-600"
      >
        <PencilIcon className="h-8 w-8 mr-4" />
      </button>
    </div>
  );
}

export default TodoCard;
