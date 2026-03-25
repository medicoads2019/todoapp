"use client";

import { FormEvent, useEffect, useState } from "react";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type TodoPayload = {
  title: string;
  description: string;
  completed: boolean;
};

const initialForm: TodoPayload = {
  title: "",
  description: "",
  completed: false,
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState<TodoPayload>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTodos() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/todos", { cache: "no-store" });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch todos");
      }

      setTodos(result.data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load todos",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/todos/${editingId}` : "/api/todos";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Operation failed");
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchTodos();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save todo",
      );
    }
  }

  async function onDelete(id: string) {
    setError("");

    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }

      await fetchTodos();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete todo",
      );
    }
  }

  function onEdit(todo: Todo) {
    setEditingId(todo._id);
    setForm({
      title: todo.title,
      description: todo.description || "",
      completed: todo.completed,
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">Todo App</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Next.js + MongoDB full CRUD
        </p>
      </section>

      <section className="rounded-lg border p-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  completed: event.target.checked,
                }))
              }
            />
            Completed
          </label>

          <div className="flex gap-2">
            <button
              className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
              type="submit"
            >
              {editingId ? "Update Todo" : "Add Todo"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Todos</h2>

        {error ? (
          <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        ) : null}

        {loading ? <p className="text-sm">Loading...</p> : null}

        {!loading && todos.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No todos yet.
          </p>
        ) : null}

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo._id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className={`font-medium ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description ? (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {todo.description}
                    </p>
                  ) : null}
                </div>

                <span className="rounded-full border px-2 py-0.5 text-xs">
                  {todo.completed ? "Done" : "Pending"}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-md border px-3 py-1.5 text-xs"
                  onClick={() => onEdit(todo)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-md border px-3 py-1.5 text-xs"
                  onClick={() => onDelete(todo._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
