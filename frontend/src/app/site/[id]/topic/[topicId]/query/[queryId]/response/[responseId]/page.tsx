"use client";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { sitesAPI } from "@/services";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";

type Props = {
  params: {
    responseId: string;
  };
};

const Response = ({ params: { responseId } }: Props) => {
  const { data: response } = useQuery({
    queryKey: [`getResponse-${responseId}`],
    queryFn: () => (responseId ? sitesAPI.getResponse(responseId) : undefined),
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
      label: moment(response.timestamp).format("DD MMMM YYYY, HH:mm A"),
    },
  ];

  return (
    <article>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="pb-4 font-bold text-lg">
        {moment(response.timestamp).format("DD MMMM YYYY, HH:mm A")}
      </h2>
      <div className="[&>p>ul]:list-disc [&>p>ol]:list-decimal [&>p>*>li]:ml-8">
        <p className="break-word [&>p>a]:text-blue-500 [&>p>a:hover]:underline">
          <Markdown remarkPlugins={[remarkGfm]}>{response.value}</Markdown>
        </p>
      </div>
      <div className="py-6 flex justify-center">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th scope="col" className="p-2 border-2">
                Expectation
              </th>
              <th scope="col" className="p-2 border-2">
                Assessment
              </th>
            </tr>
          </thead>
          <tbody>
            {response.assessments.map((assessment) => (
              <tr key={assessment.id} className="even:bg-gray-100">
                <td className="px-6 py-4 p-2 border-2">
                  {assessment.expectation.value}
                </td>
                <td className="p-2 gap-2 border-2 text-center">
                  <span
                    className="px-2 rounded-sm"
                    style={{
                      backgroundColor:
                        assessment.value.toLowerCase() === "pass"
                          ? "#22c55e"
                          : assessment.value.toLowerCase() === "fail"
                          ? "#ef4444"
                          : "#fbbf24",
                    }}
                  >
                    {assessment.value}
                  </span>
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
