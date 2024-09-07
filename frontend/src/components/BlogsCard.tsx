import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
}

export const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
  id
}: BlogCardProps) => {
  return <Link to = {`/blog/${id}`}>
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex">
          <Avatar name={authorName} size={"small"} />
        <div className="font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
        <div className="text-slate-500 pl-2">&#128900;</div>
        <div className="text-sm pl-2 font-light text-slate-600 flex justify-center flex-col"> {publishedDate}</div>
      </div>
      <div className="text-xl font-semibold pt-2">{title}</div>
      <div className="font-thin text-md">{content.slice(0, 100) + "..."}</div>
      <div className="text-slate-400 text-sm font-thin pt-2">{`${Math.ceil(
        content.length / 100
      )} minute(s) read`}</div>
    </div>
    </Link>
};

export function Avatar({ name, size ="small" }: { name: string, size: "small" | "big" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-6 h-6" : "w-10 h-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
      <span className={`${size === "small" ? "text-xs" : "text-md"} font-medium text-gray-600 dark:text-gray-300`}>
        {name[0]}
      </span>
    </div>
  );
}
