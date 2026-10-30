import { useEffect, useState } from "react";

const KEY = "erathra-board";
const listeners = new Set<(ids: string[]) => void>();

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
let ids = read();

function write(next: string[]) {
  ids = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* noop */
  }
  listeners.forEach((fn) => fn(ids));
}

export const board = {
  get: () => ids,
  has: (id: string) => ids.includes(id),
  toggle: (id: string) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]),
  set: (next: string[]) => write([...new Set(next)]),
  clear: () => write([]),
};

export function useBoard() {
  const [v, setV] = useState(ids);
  useEffect(() => {
    listeners.add(setV);
    return () => {
      listeners.delete(setV);
    };
  }, []);
  return v;
}
