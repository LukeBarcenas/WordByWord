import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Account.css";
import Achievement from "../components/Achievement";
import { ACHIEVEMENTS } from "../data/achievements";
import { useAuthContext } from "../hooks/useAuthContext";
import { handleMostRecent } from "../helper-functions/handleMostRecent";

const StatRow = ({ label, value, suffix }) => (
  <div className="d-flex justify-content-between align-items-baseline account-stat-row">
    <div className="account-stat-label">{label}</div>
    <div className="account-stat-value">
      {value !== undefined && value !== null ? value : "—"}
      {suffix ? ` ${suffix}` : ""}
    </div>
  </div>
);

const Account = () => {

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

  if (!statistics) {

    return <div></div>

  }

  const username = user.email
  const totalWordsRead = (statistics.words_read)
  const averageWpm = (statistics.average_wpm )
  const fastestWpm = (statistics.fastest_wpm)
  const longestTextReadWords = (statistics.longest_text)
  const textsRead = (statistics.texts_read)
  const mostRecentAchievementLabel = "Most Recent Achievement"
  let mostRecentAchievement = handleMostRecent(totalWordsRead, fastestWpm, textsRead, longestTextReadWords)

  let earnedAchievements = []

  if(totalWordsRead >= 1000) {

    earnedAchievements.push("words_1k")

  } 
  
  if(totalWordsRead >= 5000) {

    earnedAchievements.push("words_5k")

  } 
  
  if(totalWordsRead >= 10000) {

    earnedAchievements.push("words_10k")

  } 

  if(totalWordsRead >= 50000) {

    earnedAchievements.push("words_50k")

  }

  if(fastestWpm < 50 && textsRead >= 1) {

    earnedAchievements.push("wpm_slow")

  } 
  
  if (fastestWpm > 300 && textsRead >= 1) {

    earnedAchievements.push("wpm_fast")

  }

  if(textsRead >= 1) {

    earnedAchievements.push("readings_1")

  } 
  
  if(textsRead >= 10) {

    earnedAchievements.push("readings_10")

  } 
  
  if(textsRead >= 50) {

    earnedAchievements.push("readings_50")

  } 
  
  if(textsRead >= 100) {

    earnedAchievements.push("readings_100")

  }

  if(longestTextReadWords < 100 && textsRead >= 1) {

    earnedAchievements.push("length_short")

  } 
  
  if (longestTextReadWords > 1000 && textsRead >= 1) {

    earnedAchievements.push("length_long")

  }
  

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
              <span>{mostRecentAchievement}</span>
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
