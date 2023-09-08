import { create } from "zustand";
import { ID, databases, storage } from "@/appwrite";
import { getTodoGroupedByColunm } from "@/lib/getTodoGroupedByColumn";

interface BoardState {
  board: Board;
  getBoard: () => {};
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  addTask: (title: string, columnId: TypedColumn, description: string) => void;
  $id: string;
  setId: (id: string) => void;
  prevTaskType: TypedColumn;
  setPrevTaskType: (columnId: TypedColumn) => void;
  updateTask: (
    $id: string,
    title: string,
    columnId: TypedColumn,
    prevTaskType: TypedColumn,
    description: string
  ) => void;
  newTitleInput: string;
  newDescriptionInput: string;
  setNewTitleInput: (input: string) => void;
  setNewDescriptionInput: (input: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodoGroupedByColunm();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  newTitleInput: "",
  newDescriptionInput: "",

  setNewTitleInput: (input: string) => set({ newTitleInput: input }),
  setNewDescriptionInput: (input) => set({ newDescriptionInput: input }),

  $id: "",
  setId: (id: string) => set({ $id: id }),

  updateTodoInDb: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
        description: todo.description,
      }
    );
  },

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  addTask: async (
    title: string,
    columnId: TypedColumn,
    description: string
  ) => {
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title,
        description,
        status: columnId,
      }
    );

    set({ newTitleInput: "" });
    set({ newDescriptionInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: title,
        description: description,
        status: columnId,
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  updateTask: async (
    $id: string,
    title: string,
    columnId: TypedColumn,
    prevTaskType: TypedColumn,
    description: string
  ) => {
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      $id,
      {
        title,
        status: columnId,
        description,
      }
    );
    set({ newTitleInput: "" });
    set({ newDescriptionInput: "" });
    set({ $id: "" });
    set({ newTaskType: "todo" });

    const updatedTodo: Todo = {
      title: response.title,
      description: response.description,
      status: response.status,
      $id: response.$id,
      $createdAt: response.$createdAt,
    };

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const removedTodos = newColumns.get(prevTaskType)?.todos;
      const indexToRemove = removedTodos?.findIndex((todo) => todo.$id === $id);

      if (indexToRemove !== undefined && indexToRemove !== -1 && removedTodos) {
        removedTodos.splice(indexToRemove, 1);
      }

      const newTodos = newColumns.get(columnId)?.todos;

      if (newTodos) {
        newTodos.push(updatedTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  newTaskType: "todo",
  setNewTaskType: (ColumnId: TypedColumn) => set({ newTaskType: ColumnId }),
  prevTaskType: "todo",
  setPrevTaskType: (ColumnId: TypedColumn) => set({ prevTaskType: ColumnId }),
}));
