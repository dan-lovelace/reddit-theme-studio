import { TListingDataChild } from "@rju/types";
import { capitalize, truncate } from "lodash";

import { useAppSelector } from "../../app/hooks";
import { prettyDate } from "../../lib/time";

function PostResult({
  data: {
    author,
    created_utc,
    num_comments,
    permalink,
    thumbnail,
    title,
    ups,
    url,
  },
}: TListingDataChild) {
  return (
    <li className="post-result">
      <Thumbnail thumbnail={thumbnail} />
      <span className="post-result__title">
        <a href={permalink}>{capitalize(title)}</a>
      </span>{" "}
      <span className="post-result__url">
        (<a href={url}>{truncate(url)}</a>)
      </span>
      <div className="post-result__meta">
        {ups} points by <a href={`/user/${author}`}>{author}</a>{" "}
        {prettyDate(created_utc)} |{" "}
        <a href={permalink}>{num_comments} comments</a>
      </div>
    </li>
  );
}

function Thumbnail({ thumbnail }: { thumbnail: string }) {
  // TODO: cases for default, self, nsfw
  return (
    <div className="post-thumbnail">
      <img src={thumbnail} alt="thumbnail" />
    </div>
  );
}

export default function Subreddit() {
  const {
    data: { children },
  } = useAppSelector((state) => state.pageData);

  return (
    <div className="post-list">
      <ol className="post-list__list">
        {children.map((child, idx) => (
          <PostResult key={idx} {...child} />
        ))}
      </ol>
    </div>
  );
}
