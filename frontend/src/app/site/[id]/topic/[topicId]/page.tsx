"use client";

import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";
import ButtonLink from "@/components/ButtonLink";
import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Props = {
  params: {
    topicId: string;
  };
};

const Topic = ({ params: { topicId } }: Props) => {
  const { data: topic } = useQuery({
    queryKey: [`getTopic-${topicId}`],
    queryFn: () => (topicId ? sitesAPI.getTopic(topicId) : undefined),
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
      <div className="flex items-start justify-between">
        <h2 className="pb-4 font-bold text-lg">{topic.title}</h2>
        <ButtonLink href={`/site/${topic.site.id}/topic/${topic.id}/query/new`}>
          Add query
        </ButtonLink>
      </div>
      <ul>
        {topic.queries.map((query) => (
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
