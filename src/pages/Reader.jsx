import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../pages/Reader.css";
import ReaderSettingsMenu from "../components/ReaderSettingsMenu";
import { ReaderSettings } from "../settings/ReaderSettings";

// Splits text into 100 word chunks, rounded to the nearest end of a sentence
function splitIntoChunks(text, maxWords = 100) {
  if (!text) return [];

  // Splits based on sentence-ending punctuation (., !, ?) followed by space or endlines
  const sentences =
    text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  // Get word counts for each sentence
  const wordCounts = sentences.map((s) =>
    s.trim().length === 0 ? 0 : s.trim().split(/\s+/).length
  );

  const chunks = [];
  let i = 0;

  // Look for the best sentence to end each chunk on
  while (i < sentences.length) {
    let j = i;
    let cumulative = 0;
    let bestIdx = i;
    let bestDelta = Infinity;

    // Try adding sentences until we reach maxWords
    while (j < sentences.length) {
      cumulative += wordCounts[j] || 0;

      const delta = Math.abs(cumulative - maxWords);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIdx = j;
      }

      // Stop if the sentence brings the chunk to over 150 words
      if (cumulative >= maxWords * 1.5) break;
      j++;
    }

    // Put sentences together into a chunk
    const chunk = sentences.slice(i, bestIdx + 1).join(" ").trim();
    chunks.push(chunk);
    i = bestIdx + 1;
  }

  // If the text has no punctuation, just return it all as one chunk
  // TODO: find a way to chunk long text with no punctuation
  if (chunks.length === 0 && text.trim()) {
    chunks.push(text.trim());
  }

  return chunks;
}

export default function Reader() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Pull text from router state or sessionStorage so it stays after refreshing the page
  const text = (state?.text ?? sessionStorage.getItem("reader_text") ?? "").trim();

  // Compute chunks for the text
  const chunks = useMemo(() => splitIntoChunks(text, 100), [text]);
  const [page, setPage] = useState(0);

  // Settings management
  const { settings, setReadMode, toggleReadMode } = ReaderSettings();

  // Word read mode's current highlighted word index (null if not in read mode)
  const [wordIndex, setWordIndex] = useState(null);

  // Get words for the current chunk
  const words = useMemo(() => {
    const current = chunks[page] ?? "";
    return current.length ? current.split(/\s+/) : [];
  }, [chunks, page]);

  // Prevent scrolling so page is easier to consume for the reader
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // When the page or read mode changes, reset the word index
  useEffect(() => {
    if (settings.readMode && words.length > 0) {
      setWordIndex(0);
    } else {
      setWordIndex(null);
    }
  }, [page, settings.readMode, words.length]);

  useEffect(() => {
    // Right arrow on keyboard goes to next page
    function onKey(e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Pressing space turns on word read mode
      if (e.code === "Space") {
        e.preventDefault();

        // Start at first word if not already in read mode
        if (!settings.readMode) {
          if (words.length > 0) {
            setReadMode(true);
            setWordIndex(0);
          }
          return;
        }

        // Moving to next words
        const nextIdx = (wordIndex ?? -1) + 1;
        if (nextIdx < words.length) {
          setWordIndex(nextIdx);
        } else {
          // Checks if its at the end of the page. If so, go to next page
          if (page < chunks.length - 1) {
            setPage((p) => p + 1);
          } else {
            sessionStorage.removeItem("reader_text");
            navigate("/");
          }
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, chunks.length, wordIndex, words.length, settings.readMode]);

  // When text ends, go back to home
  function handleNext() {
    if (page < chunks.length - 1) {
      setPage((p) => p + 1);
    } else {
      // TODO: instead go to "session complete" page
      sessionStorage.removeItem("reader_text");
      navigate("/");
    }
  }

  const isLast = page === chunks.length - 1;
  const actionLabel = isLast ? "Finish" : "Next →";

  return (
    <div className="reader-page">
      <div className="reader-container" role="region" aria-label="Reading panel" aria-live="polite">
        <ReaderSettingsMenu readMode={settings.readMode} onToggleReadMode={toggleReadMode} />

        <div className="reader-text" key={page}>
          {settings.readMode && words.length > 0
            ? words.map((w, idx) => (
                <span
                  key={idx}
                  className={`reader-word${wordIndex === idx ? " is-active" : ""}`}
                >
                  {w}
                  {idx < words.length - 1 ? " " : ""}
                </span>
              ))
            : chunks[page]}
        </div>

        <div className="reader-footer">
          <div className="reader-progress">
            {chunks.length > 1 ? `${page + 1} / ${chunks.length}` : ""}
          </div>
          <button type="button" className="reader-next" onClick={handleNext} aria-label={actionLabel}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
