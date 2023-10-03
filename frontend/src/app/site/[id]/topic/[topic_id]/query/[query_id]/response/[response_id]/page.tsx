"use client";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CheckMark from "@/assets/check-mark.svg";
import { default as Cross, default as QuestionMark } from "@/assets/x.svg";
import { sitesAPI } from "@/services";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";

type Props = {
  params: {
    response_id: string;
  };
};

const Response = ({ params: { response_id } }: Props) => {
  const { data: response } = useQuery({
    queryKey: ["getResponse"],
    queryFn: () =>
      response_id ? sitesAPI.getResponse(response_id) : undefined,
  });

  if (!response) {
    return null;
  }

  const breadcrumbs: Breadcrumb[] = [
    {
      label: response.query.topic.site.title,
      link: `/site/${response.query.topic.site.id}`,
    },
    {
      label: response.query.topic.title,
      link: `/site/${response.query.topic.site.id}/topic/${response.query.topic.id}`,
    },
    {
      label: response.query.value,
      link: `/site/${response.query.topic.site.id}/topic/${response.query.topic.id}/query/${response.query.id}`,
    },
    {
      label: moment(response.timestamp).format("DD MMMM YYYY HH:mm A"),
    },
  ];

  return (
    <article>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="pb-4 font-bold text-lg">
        {moment(response.timestamp).format("DD MMMM YYYY HH:mm A")}
      </h2>
      <div className="[&>p>ul]:list-disc [&>p>ol]:list-decimal [&>p>*>li]:ml-8">
        <p className="break-word [&>p>a]:text-blue-500 [&>p>a:hover]:underline">
          <Markdown remarkPlugins={[remarkGfm]}>{response.value}</Markdown>
        </p>
      </div>
      <div className="py-6 flex justify-center">
        <table>
          <thead className="bg-gray-100">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th scope="col" className="px-6 py-3">
                Expectation
              </th>
              <th scope="col" className="px-6 py-3">
                Assessment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {response.assessment_set.map((assessment) => (
              <tr
                key={assessment.id}
                className="transition duration-150 ease-in-out"
              >
                <td className="px-6 py-4">{assessment.expectation.value}</td>
                <td className="flex gap-2 px-6 py-4 items-center">
                  {assessment.value}
                  {assessment.value === "Pass" ? (
                    <CheckMark width="16px" height="16px" />
                  ) : assessment.value === "Fail" ? (
                    <Cross height="14px" width="14px" />
                  ) : (
                    <QuestionMark height="16px" width="16px" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default Response;
