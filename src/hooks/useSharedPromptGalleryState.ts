import { useCallback, useEffect, useState } from "react";
import type { FiltersState } from "@/components/filters/FiltersPanel";

type SharedState = {
  filters: FiltersState;
  searchTerm: string;
};

const STORAGE_KEY = "shared-prompts-gallery-state";

const defaultState: SharedState = {
  filters: {},
  searchTerm: "",
};

const getStoredState = (): SharedState => {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<SharedState>;
    return {
      filters: parsed.filters ?? {},
      searchTerm: parsed.searchTerm ?? "",
    };
  } catch {
    return defaultState;
  }
};

export const useSharedPromptGalleryState = () => {
  const [state, setState] = useState<SharedState>(() => getStoredState());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setState(getStoredState());
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setSearchTerm = useCallback(
    (value: string | ((prev: string) => string)) => {
      setState((prev) => ({
        ...prev,
        searchTerm: typeof value === "function" ? value(prev.searchTerm) : value,
      }));
    },
    []
  );

  const setFilters = useCallback(
    (value: FiltersState | ((prev: FiltersState) => FiltersState)) => {
      setState((prev) => ({
        ...prev,
        filters: typeof value === "function" ? value(prev.filters) : value,
      }));
    },
    []
  );

  return {
    searchTerm: state.searchTerm,
    setSearchTerm,
    filters: state.filters,
    setFilters,
  };
};
