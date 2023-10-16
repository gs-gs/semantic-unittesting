"use client";

import Link from "next/link";
import { Topic } from "../services/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sitesAPI } from "@/services";
import { GET_SITE_QUERY_KEY } from "@/app/site/[id]/layout";

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
  const queryClient = useQueryClient();
  const [newTopic, setNewTopic] = useState("");

  const { mutate } = useMutation({
    mutationFn: () =>
      sitesAPI.newTopic({
        title: newTopic,
        site_id: extractIdFromPath(pathname),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries([GET_SITE_QUERY_KEY]);
      setNewTopic("");
    },
  });

  const handleNewTopic = () => {
    mutate();
  };

  return (
    <nav className="md:sticky md:top-0 md:h-screen">
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-100">
        <div className="mb-2 font-bold">
          <h2 className="mb-2">Topics</h2>
          <div className="flex">
            <input
              className="px-2 font-normal border-2 border-gray-600 rounded-l-md w-full"
              placeholder="new topic"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
            <button
              className="px-2 rounded-r-md border-gray-600 bg-gray-600 text-white hover:bg-gray-300 disabled:hover:bg-gray-200"
              onClick={handleNewTopic}
            >
              Add
            </button>
          </div>
        </div>
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
