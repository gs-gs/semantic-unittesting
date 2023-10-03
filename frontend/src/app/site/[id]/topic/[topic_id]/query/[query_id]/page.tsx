"use client";

import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import moment from "moment";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";

type Props = {
  params: {
    query_id: string;
  };
};

const Query = ({ params: { query_id } }: Props) => {
  const { data: query } = useQuery({
    queryKey: ["getQuery"],
    queryFn: () => (query_id ? sitesAPI.getQuery(query_id) : undefined),
  });

  if (!query) {
    return null;
  }

  const breadcrumbs: Breadcrumb[] = [
    {
      label: query.topic.site.title,
      link: `/site/${query.topic.site.id}`,
    },
    {
      label: query.topic.title,
      link: `/site/${query.topic.site.id}/topic/${query.topic.id}`,
    },
    {
      label: query.value,
    },
  ];

  return (
    <article>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="pb-4 font-bold text-lg">{query.value}</h2>
      <ul className="space-y-2">
        {query.response_set.map((response) => (
          <li key={response.id}>
            <div className="flex gap-4">
              <Link
                href={`/site/${query.topic.site.id}/topic/${query.topic.id}/query/${query.id}/response/${response.id}`}
                className="shrik-1 italic text-gray-500 hover:underline"
              >
                <div className="flex flex-col items-end">
                  <span>{moment(response.timestamp).format("DD/MM/YYYY")}</span>
                  <span>{moment(response.timestamp).format("HH:mm A")}</span>
                </div>
              </Link>
              <div className="[&>p>ul]:list-disc [&>p>ol]:list-decimal [&>p>*>li]:ml-8">
                <p className="shrink-[4] [&>p>a]:text-blue-500 [&>p>a:hover]:underline">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {response.value}
                  </Markdown>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Query;
