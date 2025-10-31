import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Account.css";
import Achievement from "../components/Achievement";
import { ACHIEVEMENTS } from "../data/achievements";

const StatRow = ({ label, value, suffix }) => (
  <div className="d-flex justify-content-between align-items-baseline account-stat-row">
    <div className="account-stat-label">{label}</div>
    <div className="account-stat-value">
      {value !== undefined && value !== null ? value : "—"}
      {suffix ? ` ${suffix}` : ""}
    </div>
  </div>
);

const Account = ({ userData = {} }) => {
  const {
    // put actual user data here
    username = "SuperReader42",
    totalWordsRead = 14039,
    averageWpm = 220,
    fastestWpm = 301,
    longestTextReadWords = 1036,
    textsRead = 6,
    mostRecentAchievementLabel = "Most Recent Achievement",
    // instead of hardcoding, put the achievements the user has earned here
    earnedAchievements = ["words_1k", "readings_1", "readings_100"], 
  } = userData;

  const formatNum = (n) =>
    typeof n === "number" ? n.toLocaleString() : n ?? "—";

  const earnedSet = new Set(earnedAchievements);

  // shows icon or greyed out icon based on if earned
  const iconFor = (iconBase, isEarned) =>
    isEarned
      ? `/media/${iconBase}.png`
      : `/media/badge_grey.png`;

  return (
    <div className="container account-page py-4">
      <div className="row g-4">
        {/* left side */}
        <div className="col-12 col-lg-7">
          <h1 className="account-username mb-3">{username}</h1>
          <hr className="account-divider" />

          <div className="account-stats mt-3">
            <StatRow label="Total Words Read:" value={formatNum(totalWordsRead)} />
            <StatRow label="Average WPM:" value={formatNum(averageWpm)} />
            <StatRow label="Fastest WPM:" value={formatNum(fastestWpm)} />
            <StatRow
              label="Longest Text Read:"
              value={formatNum(longestTextReadWords)}
              suffix="Words"
            />
            <StatRow label="Texts Read:" value={formatNum(textsRead)} />
          </div>

          <hr className="account-divider mt-4" />

          <div className="account-mra mt-3">
            <div className="account-mra-title">Most Recent Achievement:</div>
            <div className="account-most-recent-achievement mt-2" role="region" aria-label="Most recent achievement">
              {/* put most recent achievement here */}
              <span>(None)</span>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="col-12 col-lg-5">
          <div className="account-right-card p-3">
            <h2 className="account-achievements-title">Achievements:</h2>

            <div className="account-achievements-scroll mt-2" role="list" aria-label="Achievements list">
              {ACHIEVEMENTS.map((a) => {
                const isEarned = earnedSet.has(a.id);
                return (
                  <div className="account-achievement-item mb-3" role="listitem" key={a.id}>
                    <Achievement
                      icon={`/media/${a.icon}.png`}
                      title={a.title}
                      description={a.description}
                      isGrey={!isEarned}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
