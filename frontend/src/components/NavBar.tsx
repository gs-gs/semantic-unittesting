"use client";

import Link from "next/link";
import { Topic } from "../services/types";
import { usePathname } from "next/navigation";

type Props = {
  topics: Topic[];
};

const extractIdFromPath = (path: string, segment = "site"): string => {
  const segments = path.split("/");
  if (segments.includes(segment)) {
    const segmentIndex = segments.indexOf(segment);
    const hasId = segments.length >= segmentIndex + 2;

    if (hasId) {
      return segments[segmentIndex + 1];
    }
  }

  return "";
};

const NavBar: React.FC<Props> = ({ topics }) => {
  const pathname = usePathname();

  return (
    <nav className="md:sticky md:top-0 md:h-screen">
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-100">
        <ul className="space-y-2 font-medium">
          {topics
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((topic) => {
              const active =
                extractIdFromPath(pathname, "topic") === topic.id.toString();
              return (
                <li key={topic.id}>
                  <Link
                    href={`/site/${topic.site.id}/topic/${topic.id}`}
                    className={`flex items-center p-2 text-gray-900 rounded-lg border border-blue-100 hover:border-blue-300 group ${
                      active ? "bg-blue-300" : ""
                    }`}
                  >
                    {topic.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
