"use client";

import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";
import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Props = {
  params: {
    topic_id: string;
  };
};

const Topic = ({ params: { topic_id } }: Props) => {
  const { data: topic } = useQuery({
    queryKey: ["getTopic"],
    queryFn: () => (topic_id ? sitesAPI.getTopic(topic_id) : undefined),
  });

  if (!topic) {
    return null;
  }

  const breadcrumbs: Breadcrumb[] = [
    {
      label: topic.site.title,
      link: `/site/${topic.site.id}`,
    },
    {
      label: topic.title,
    },
  ];

  return (
    <article>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="pb-4 font-bold text-lg">{topic.title}</h2>
      <ul>
        {topic.query_set.map((query) => (
          <li key={query.id}>
            <Link
              href={`/site/${topic.site.id}/topic/${topic.id}/query/${query.id}`}
              className="hover:underline"
            >
              <h3>{query.value}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Topic;
