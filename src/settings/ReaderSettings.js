// Here we manage the setting in the reader

import { useEffect, useReducer } from "react";

const STORAGE_KEY = "reader_settings";

const initialState = {
  readMode: false,
  focusLine: false,
  // add more stuff here later
};

// Reducer to manage settings state
function reducer(state, action) {
  switch (action.type) {
    case "SET_READ_MODE":
      return { ...state, readMode: action.value };
    case "TOGGLE_READ_MODE":
      return { ...state, readMode: !state.readMode };

    case "SET_FOCUS_LINE":
      return { ...state, focusLine: action.value };
    case "TOGGLE_FOCUS_LINE":
      return { ...state, focusLine: !state.focusLine };

    default:
      return state;
  }
}

// Custom hook to use reader settings
export function ReaderSettings() {
  const [state, dispatch] = useReducer(reducer, initialState, (base) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...base, ...JSON.parse(raw) } : base;
    } catch {
      return base;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // For read mode
  const setReadMode = (value) => dispatch({ type: "SET_READ_MODE", value });
  const toggleReadMode = () => dispatch({ type: "TOGGLE_READ_MODE" });

  // For focus line
  const setFocusLine = (value) => dispatch({ type: "SET_FOCUS_LINE", value });
  const toggleFocusLine = () => dispatch({ type: "TOGGLE_FOCUS_LINE" });

  return {
    settings: state,
    setReadMode,
    toggleReadMode,

    setFocusLine,
    toggleFocusLine,
  };
}
