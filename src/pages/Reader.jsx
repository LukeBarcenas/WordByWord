import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../pages/Reader.css";
import ReaderSettingsMenu from "../components/ReaderSettingsMenu";
import { useReaderSettings } from "../settings/ReaderSettings";
import { useAuthContext } from "../hooks/useAuthContext";

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

  // Calculate totalwords
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

  return { chunks, totalWords };
}

export default function Reader() {

  const [statistics, setStatistics] = useState(null)
  const {user} = useAuthContext()
  
    useEffect(() => {
  
      const fetchStatistics = async () => {
  
        const response = await fetch('/api/statistic', {
          headers: {
  
            'Authorization': `Bearer ${user.token}`
  
          }
        })
  
        const json = await response.json()
  
        if(!json) {
  
          const defaultStats = {
            words_read: 0,
            average_wpm: 0,
            fastest_wpm: 0,
            longest_text: 0,
            texts_read: 0
          }
  
          const response = await fetch('/api/statistic', {
          method: 'POST',
          body: JSON.stringify(defaultStats),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
  
          }
          })
  
          if(response.ok) {
            fetchStatistics()
          }
  
        }
  
        if(response.ok) {
  
          setStatistics(json)
          
        }
  
      }
  
      if(user) {
  
        fetchStatistics()
  
      }
  
  
    }, [user])

  const { state } = useLocation();
  const navigate = useNavigate();
  const [wpm, setWpm] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const startTimeRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [font, setFont] = useState("Lexend");
  const [words_read, setWords_Read] = useState(null)
  const [average_wpm, setAverage_WPM] = useState(null)
  const [fastest_wpm, setFastest_WPM] = useState(null)
  const [longest_text, setLongest_Text] = useState(null)
  const [texts_read, setTexts_Read] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {

    if (statistics) {
      setWords_Read(statistics.words_read)
      setAverage_WPM(statistics.average_wpm)
      setFastest_WPM(statistics.fastest_wpm)
      setLongest_Text(statistics.longest_text)
      setTexts_Read(statistics.texts_read)
    }
}, [statistics])

  const updateWords_Read = async () => {

    const response = await fetch('/api/statistic', {

      method: 'PATCH',
      body: JSON.stringify({words_read: words_read}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }

    })

    const json = await response.json()

    if(!response.ok) {

      setError(json.error)

    } else {

      setError(null)

    }

  }

  const updateStatistics = async () => {

    const statistic = {words_read, average_wpm, fastest_wpm, longest_text, texts_read}

    console.log(statistic)

    const response = await fetch('/api/statistic', {

      method: 'PATCH',
      body: JSON.stringify(statistic),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }

    })

    const json = await response.json()

    if(!response.ok) {

      setError(json.error)

    } else {

      setError(null)

    }

  }

  // Pull text from router state or sessionStorage so it stays after refreshing the page
  const text = (state?.text ?? sessionStorage.getItem("reader_text") ?? "").trim();

  // Compute chunks for the text
  const { chunks, totalWords } = useMemo(() => splitIntoChunks(text, 100), [text]);
  const [page, setPage] = useState(0);

  // Settings management
  const {
    settings,
    setReadMode,
    toggleReadMode,
    toggleHighlightMode,
    toggleMagnifyMode,
    toggleFocusLine,
  } = useReaderSettings();

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
      if (!chunks[i]) continue;
      sum += chunks[i].split(/\s+/).length;
    }
    return sum + (wordIndex ?? 0);
  }, [chunks, page, wordIndex]);

  // Progress bar 
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

  // so dark mode does not persist
  useEffect(() => {
    return () => {
      document.body.classList.remove('dark-mode');
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

  useEffect(() => {
    // Right arrow on keyboard goes to next page
    function onKey(e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Left arrow on keyboard goes back a word
      if (e.key === "ArrowLeft") {
        e.preventDefault();

        if (settings.readMode && wordIndex !== null) {
          if (wordIndex > 0) {
            setWordIndex(wordIndex - 1);

            setWords_Read(words_read - 1)

            if(words_read < 0) {
  
              setWords_Read(0)

            }

          }
          else if (page > 0) {
            setPage((p) => p - 1);
            const words = (chunks[page - 1] ?? "").split(/\s+/);
            setWordIndex(words.length - 1);
          }
        }
        return;
      }

      // Pressing space turns on word read mode
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();

        setWords_Read(words_read + 1)

        // WPM
        if (!startTimeRef.current) {
          startTimeRef.current = new Date();
        }

        setWordCount((prev) => {
          const newCount = prev + 1;
          const minutes = Math.max((new Date() - startTimeRef.current) / (60000), 0.001);

          const newWpm = Math.round(newCount / minutes);

          setWpm(newWpm);

          return newCount;
        });

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

          if(nextIdx == words.length - 1 && page == (chunks.length - 1)) {

            if(average_wpm != 0) {

              setAverage_WPM(Math.round((wpm + average_wpm) / 2))

            } else {

              setAverage_WPM(Math.round(wpm))

            }

            if(wpm > fastest_wpm) {

              setFastest_WPM(wpm)

            }

            setTexts_Read(texts_read + 1)

            if(totalWords > longest_text) {
              
              setLongest_Text(totalWords)

            }

          }
        } else {
          // Checks if its at the end of the page. If so, go to next page
          if (page < chunks.length - 1) {
            setPage((p) => p + 1);

            // Automatically start read mode on next page if possible
          } else {

            updateStatistics()
            sessionStorage.removeItem("reader_text");
            navigate("/");
          }
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, chunks.length, wordIndex, words.length, settings.readMode, setReadMode, navigate]);

  // When text ends, go back to home
  function handleNext() {
    if (page < chunks.length - 1) {
      setPage((p) => p + 1);
    } else {

      // TODO: instead go to "session complete" page
      updateStatistics()
      sessionStorage.removeItem("reader_text");
      navigate("/");
    }
  }

  function themeChange(newTheme) {
    setTheme(newTheme);
  }

  function fontChange(newFont) {
    setFont(newFont);
  }

  const isLast = page === chunks.length - 1;
  const actionLabel = isLast ? "Finish" : "Next →";

  return (
    <div className={`reader-page ${theme === "dark" ? "dark-mode" : ""}`} style={{fontFamily: font}}>
      <div className="reader-container" role="region" aria-label="Reading panel" aria-live="polite">
        <div className="words-per-minute">
          WPM <br />
          {wpm}
        </div>

        <ReaderSettingsMenu
          readMode={settings.readMode}
          onToggleReadMode={toggleReadMode}
          highlightMode={settings.highlightMode}
          onToggleHighlightMode={toggleHighlightMode}
          magnifyMode={settings.magnifyMode}
          onToggleMagnifyMode={toggleMagnifyMode}
          focusLine={settings.focusLine}
          onToggleFocusLine={toggleFocusLine}
          theme={theme}
          onToggleTheme={themeChange}
          font={font}
          onToggleFont={fontChange}
        />

        <div className="reader-text" key={page} ref={textRef}>
          {settings.readMode && words.length > 0
            ? words.map((w, idx) => {
                let dim = false;
                if (settings.focusLine && currentLineTop !== null) {
                  const el = wordRefs.current[idx];
                  if (el) {
                    const t = Math.round(el.getBoundingClientRect().top);
                    const TOL = settings.magnifyMode ? 10 : 2;
                    dim = Math.abs(t - currentLineTop) > TOL;
                  }
                }

                let classes = "reader-word";
                if (wordIndex === idx) {
                  if (settings.highlightMode) classes += " is-active";
                  if (settings.magnifyMode) classes += " is-magnified";
                }
                if (dim) classes += " is-dim";

                return (
                  <span
                    key={idx}
                    ref={(node) => (wordRefs.current[idx] = node)}
                    className={classes}
                  >
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

          <div
            className="progress"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={progressBar}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ "--bs-progress-bar-bg": "#38CB82" }}
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${progressBar}%` }}
            ></div>
          </div>

          <button type="button" className="reader-next" onClick={handleNext} aria-label={actionLabel}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
