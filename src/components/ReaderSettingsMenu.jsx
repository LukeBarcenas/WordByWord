// This is the settings menu in the reader

import { useEffect, useRef, useState } from "react";
import "../pages/Reader.css";

export default function ReaderSettings({
    readMode,
    onToggleReadMode,
    highlightMode,
    onToggleHighlightMode,
    magnifyMode,
    onToggleMagnifyMode,
  }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close menu if clicking outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="reader-topbar">
      <div className="settings" ref={ref}>
        <button
          className="settings-button"
          aria-haspopup="true"
          aria-expanded={open ? "true" : "false"}
          aria-controls="settings-menu"
          onClick={() => setOpen((v) => !v)}
          title="Settings"
        >
          <span className="hamburger" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="settings-label">Settings</span>
        </button>

        {open && (
          <div id="settings-menu" className="settings-menu" role="menu">
            <label
              className="settings-item read-mode"
              role="menuitemcheckbox"
              aria-checked={readMode ? "true" : "false"}
            >
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={readMode}
                onChange={onToggleReadMode}
              />
              Read mode
            </label>

            <label
              className="settings-item secondary"
              role="menuitemcheckbox"
              aria-checked={highlightMode ? "true" : "false"}
            >
              <input
                type="checkbox"
                className="settings-checkbox-secondary"
                checked={highlightMode}
                onChange={onToggleHighlightMode}
              />
              Highlight mode
            </label>

            <label
              className="settings-item secondary"
              role="menuitemcheckbox"
              aria-checked={magnifyMode ? "true" : "false"}
            >
              <input
                type="checkbox"
                className="settings-checkbox-secondary"
                checked={magnifyMode}
                onChange={onToggleMagnifyMode}
              />
              Magnify mode
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
