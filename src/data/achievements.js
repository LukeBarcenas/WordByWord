// All of the achievements available

export const ACHIEVEMENTS = [
  // Word count
  { id: "words_1k",    title: "First 1000!",            description: "1000 words read",                 icon: "badge" },
  { id: "words_5k",    title: "Just Read a 5k!",        description: "5000 words read",                 icon: "badge_1" },
  { id: "words_10k",   title: "Studious",               description: "10000 words read",                icon: "badge_2" },
  { id: "words_50k",   title: "Bookworm",               description: "50000 words read",                icon: "badge_4" },

  // WPM
  { id: "wpm_slow",  title: "Took my Time",           description: "Finished a reading with < 50 WPM", icon: "badge_5" },
  { id: "wpm_fast",  title: "Fastest Reader Alive!",  description: "Finished a reading with > 300 WPM", icon: "badge_7" },

  // Finished readings
  { id: "readings_1",     title: "First Chapter",          description: "Finished your first reading",     icon: "badge" },
  { id: "readings_10",    title: "Story Time!",            description: "Finished 10 readings",            icon: "badge_1" },
  { id: "readings_50",    title: "Page Turner",            description: "Finished 50 readings",            icon: "badge_2" },
  { id: "readings_100",   title: "Reader Supreme",         description: "Finish 100 readings",             icon: "badge_4" },

  // Text length
  { id: "length_short",   title: "What Kind of Story was That?",
                        description: "Finish a reading that’s less than 100 words",     icon: "badge_5" },
  { id: "length_long",    title: "Finished the Whole Novel!",
                        description: "Finished reading a text that’s longer than 1000 words", icon: "badge_6" },
];
