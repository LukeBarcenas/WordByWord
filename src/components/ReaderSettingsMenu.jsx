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
  focusLine,
  onToggleFocusLine,
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

            <div className={`settings-subgroup ${readMode ? "" : "is-disabled"}`}>
              <label className="settings-item" role="menuitemradio" aria-checked={highlightMode ? "true" : "false"}>
                <input
                  type="radio"
                  name="read-effect"
                  className="settings-checkbox-secondary"
                  checked={!!highlightMode}
                  onChange={() => onToggleHighlightMode()}
                  disabled={!readMode}
                />
                Highlight
              </label>

              <label className="settings-item" role="menuitemradio" aria-checked={magnifyMode ? "true" : "false"}>
                <input
                  type="radio"
                  name="read-effect"
                  className="settings-checkbox-secondary"
                  checked={!!magnifyMode}
                  onChange={() => onToggleMagnifyMode()}
                  disabled={!readMode}
                />
                Magnify
              </label>

              <label className="settings-item" role="menuitemcheckbox" aria-checked={focusLine ? "true" : "false"}>
                <input
                  type="checkbox"
                  className="settings-checkbox-secondary"
                  checked={!!focusLine}
                  onChange={onToggleFocusLine}
                  disabled={!readMode}
                />
                Focus on current line
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
