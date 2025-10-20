import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../pages/Reader.css";
import ReaderSettingsMenu from "../components/ReaderSettingsMenu";
import { useReaderSettings } from "../settings/ReaderSettings";

// Splits text into 100 word chunks, rounded to the nearest end of a sentence
function splitIntoChunks(text, maxWords = 100) {
  if (!text) return { chunks: [], totalWords: 0 };

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

  let totalWords = 0;
  for (let w = 0; w < wordCounts.length; w++) {
    totalWords += wordCounts[w];
  }

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

  return {chunks , totalWords};
}

export default function Reader() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Pull text from router state or sessionStorage so it stays after refreshing the page
  const text = (state?.text ?? sessionStorage.getItem("reader_text") ?? "").trim();

  // Compute chunks for the text
  const {chunks, totalWords} = useMemo(() => splitIntoChunks(text, 100), [text]);
  const [page, setPage] = useState(0);

  // Settings management
  const { settings, setReadMode, toggleReadMode, toggleHighlightMode, toggleMagnifyMode, toggleFocusLine} = useReaderSettings();

  // Word read mode's current highlighted word index (null if not in read mode)
  const [wordIndex, setWordIndex] = useState(null);

  // Get words for the current chunk
  const words = useMemo(() => {
    const current = chunks[page] ?? "";
    return current.length ? current.split(/\s+/) : [];
  }, [chunks, page]);

  // total
  const currentWordIndex = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < page; i++) {
      sum += chunks[i].split(/\s+/).length;
    }

    return sum + (wordIndex ?? 0);
  }, [chunks, page, wordIndex]);

  const progressBar = totalWords > 0
    ? Math.min(100, (currentWordIndex / totalWords) * 100)
    : 0;

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

  // If read mode is turned off while focus line is still on, turn focus line off too
  useEffect(() => {
    if (!settings.readMode && settings.focusLine) {
      toggleFocusLine();
    }
  }, [settings.readMode, settings.focusLine, toggleFocusLine]);

  // Gray out non-current lines
  const textRef = useRef(null);
  const wordRefs = useRef([]);
  const [currentLineTop, setCurrentLineTop] = useState(null);

  // Make ref array match words length
  useEffect(() => {
    wordRefs.current = new Array(words.length);
  }, [words.length]);

  useEffect(() => {
    if (!settings.readMode || !settings.focusLine) {
      setCurrentLineTop(null);
      return;
    }
    function measure() {
      const activeEl = wordIndex !== null ? wordRefs.current[wordIndex] : null;
      if (!activeEl) {
        setCurrentLineTop(null);
        return;
      }
      const top = Math.round(activeEl.getBoundingClientRect().top);
      setCurrentLineTop(top);
    }
    measure();
    window.addEventListener("resize", measure);
    const id = setInterval(measure, 200);
    return () => {
      window.removeEventListener("resize", measure);
      clearInterval(id);
    };
  }, [settings.readMode, settings.focusLine, wordIndex, page, words.length]);

  // Right arrow on keyboard goes to next page
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
            // Automatically start read mode on next page if possible
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
        <ReaderSettingsMenu
          readMode={settings.readMode}
          onToggleReadMode={toggleReadMode}
          highlightMode={settings.highlightMode}
          onToggleHighlightMode={toggleHighlightMode}
          magnifyMode={settings.magnifyMode}
          onToggleMagnifyMode={toggleMagnifyMode}
        />

        <div className="reader-text" key={page}>
          {settings.readMode && words.length > 0
            ? words.map((w, idx) => {
                let classes = "reader-word";
                if (wordIndex === idx) {
                  if (settings.highlightMode) classes += " is-active";
                  if (settings.magnifyMode) classes += " is-magnified";
                }
                return (
                <span key={idx} className={classes}>
                  {w}
                  {idx < words.length - 1 ? " " : ""}
                </span>
                );
              })
            : chunks[page]}
        </div>

        <div className="reader-footer">
          <div className="reader-progress">
            {chunks.length > 1 ? `${page + 1} / ${chunks.length}` : ""}
          </div>

          <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow={progressBar} aria-valuemin="0" aria-valuemax="100" style={{'--bs-progress-bar-bg': '#38CB82'}}>
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: `${progressBar}%`}}></div>
          </div>

          <button type="button" className="reader-next" onClick={handleNext} aria-label={actionLabel}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
