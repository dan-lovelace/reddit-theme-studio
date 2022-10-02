import { TChild } from "@rju/types";

import { useAppSelector } from "../../app/hooks";

function PostResult({ data: { thumbnail, title } }: TChild) {
  return (
    <div className="post-result">
      <Thumbnail thumbnail={thumbnail} />
      <div className="post-result__title">{title}</div>
    </div>
  );
}

function Thumbnail({ thumbnail }: { thumbnail: string }) {
  return (
    <div className="post-thumbnail">
      <img src={thumbnail} alt="thumbnail" />
    </div>
  );
}

export default function PostList() {
  const { children } = useAppSelector((state) => state.pageData);

  return (
    <div className="post-list">
      {children.map((child, idx) => (
        <PostResult key={idx} {...child} />
      ))}
    </div>
  );
}
