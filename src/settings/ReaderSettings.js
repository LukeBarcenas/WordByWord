// Here we manage the setting in the reader

import { useEffect, useReducer } from "react";

const STORAGE_KEY = "reader_settings";

const initialState = {
  readMode: false,
  highlightMode: true,
  magnifyMode: false,
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

    case "SET_HIGHLIGHT_MODE":
      return { ...state, highlightMode: action.value };

    case "TOGGLE_HIGHLIGHT_MODE":
      return { ...state, highlightMode: !state.highlightMode };

    case "SET_MAGNIFY_MODE":
      return { ...state, magnifyMode: action.value };

    case "TOGGLE_MAGNIFY_MODE":
      return { ...state, magnifyMode: !state.magnifyMode };

    case "SET_FOCUS_LINE":
      return { ...state, focusLine: action.value };

    case "TOGGLE_FOCUS_LINE":
      return { ...state, focusLine: !state.focusLine };

    default:
      return state;
  }
}

// Custom hook to use reader settings
export function useReaderSettings() {
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

  // Keep dependent modes coherent with readMode state
  useEffect(() => {
    if (!state.readMode) {
      if (state.focusLine) dispatch({ type: "SET_FOCUS_LINE", value: false });
      if (state.magnifyMode) dispatch({ type: "SET_MAGNIFY_MODE", value: false });
      if (state.highlightMode) dispatch({ type: "SET_HIGHLIGHT_MODE", value: false });
    } else {
      // turn on highlight and focus line by default
      if (!state.highlightMode && !state.magnifyMode) {
        dispatch({ type: "SET_HIGHLIGHT_MODE", value: true });
      }
      if (!state.focusLine) {
        dispatch({ type: "SET_FOCUS_LINE", value: true });
      }
    }
  }, [state.readMode]);

  const setReadMode = (value) => dispatch({ type: "SET_READ_MODE", value });
  const toggleReadMode = () => dispatch({ type: "TOGGLE_READ_MODE" });

  // Make highlight and magnify act as radio buttons
  const setHighlightMode = (value) => {
    if (value) {
      dispatch({ type: "SET_HIGHLIGHT_MODE", value: true });
      if (state.magnifyMode) dispatch({ type: "SET_MAGNIFY_MODE", value: false });
    } else {
      dispatch({ type: "SET_HIGHLIGHT_MODE", value: false });
    }
  };
  const toggleHighlightMode = () => setHighlightMode(!state.highlightMode);

  const setMagnifyMode = (value) => {
    if (value) {
      dispatch({ type: "SET_MAGNIFY_MODE", value: true });
      if (state.highlightMode) dispatch({ type: "SET_HIGHLIGHT_MODE", value: false });
    } else {
      dispatch({ type: "SET_MAGNIFY_MODE", value: false });
    }
  };
  const toggleMagnifyMode = () => setMagnifyMode(!state.magnifyMode);

  const setFocusLine = (value) => dispatch({ type: "SET_FOCUS_LINE", value });
  const toggleFocusLine = () => dispatch({ type: "TOGGLE_FOCUS_LINE" });

  return {
    settings: state,
    setReadMode,
    toggleReadMode,
    setHighlightMode,
    toggleHighlightMode,
    setMagnifyMode,
    toggleMagnifyMode,
    setFocusLine,
    toggleFocusLine,
  };
}
