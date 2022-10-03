import { browser } from "@rju/core";

const redditLogo = browser.runtime.getURL("reddit_logo_32.png");

const LINKS = [
  {
    text: "Popular",
    to: "r/popular",
  },
  {
    text: "All",
    to: "r/all",
  },
  {
    text: "Random",
    to: "r/random",
  },
  {
    text: "Users",
    to: "users",
  },
  {
    text: "AskReddit",
    to: "r/askreddit",
  },
  {
    text: "WorldNews",
    to: "r/worldnews",
  },
  {
    text: "Pics",
    to: "r/pics",
  },
  {
    text: "Funny",
    to: "r/funny",
  },
  {
    text: "Movies",
    to: "r/movies",
  },
  {
    text: "Gaming",
    to: "r/gaming",
  },
  {
    text: "News",
    to: "r/news",
  },
  {
    text: "MildlyInteresting",
    to: "r/mildlyinteresting",
  },
  {
    text: "TodayILearned",
    to: "r/todayilearned",
  },
  {
    text: "NotTheOnion",
    to: "r/nottheonion",
  },
  {
    text: "videos",
    to: "r/videos",
  },
  {
    text: "ExplainLikeImFive",
    to: "r/explainlikeimfive",
  },
  {
    text: "Aww",
    to: "r/aww",
  },
  {
    text: "Jokes",
    to: "r/jokes",
  },
  {
    text: "TIFU",
    to: "r/tifu",
  },
  {
    text: "Music",
    to: "r/music",
  },
  {
    text: "OldSchoolCool",
    to: "r/oldschoolcool",
  },
  {
    text: "IAMA",
    to: "r/iama",
  },
  {
    text: "TwoXChromosomes",
    to: "r/twoxchromosomes",
  },
  {
    text: "LifeProTips",
    to: "r/lifeprotips",
  },
  {
    text: "DataIsBeatiful",
    to: "r/dataisbeautiful",
  },
  {
    text: "ShowerThoughts",
    to: "r/showerthoughts",
  },
  {
    text: "AskScience",
    to: "r/askscience",
  },
  {
    text: "Books",
    to: "r/books",
  },
  {
    text: "Gifs",
    to: "r/gifs",
  },
];

export default function Header() {
  return (
    <header className="page-header">
      <div className="page-header__logo">
        <a href="/">
          <img src={redditLogo} />
          Reddit
        </a>
      </div>
      {LINKS.map((link, idx) => (
        <div key={idx}>
          <a className="page-header__link" href={link.to}>
            {link.text}
          </a>
          {idx < LINKS.length - 1 && (
            <span style={{ marginLeft: "3px", marginRight: "3px" }}>|</span>
          )}
        </div>
      ))}
    </header>
  );
}
