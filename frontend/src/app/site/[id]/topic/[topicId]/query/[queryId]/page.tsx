"use client";

import { sitesAPI } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  params: {
    id: string;
    topicId: string;
    queryId: string;
  };
};

const Query = ({ params: { id, topicId, queryId } }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newExpectation, setNewExpectation] = useState("");
  const { data: query } = useQuery({
    queryKey: [`getQuery-${queryId}`],
    queryFn: () => (queryId ? sitesAPI.getQuery(queryId) : undefined),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      sitesAPI.newExpectation({ value: newExpectation, query_id: queryId }),
    onSuccess: () => {
      queryClient.invalidateQueries([`getQuery-${queryId}`]);
      setNewExpectation("");
    },
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

  const handleAddExpectation = () => {
    mutate();
  };

  const handleTableRowClick = (responseId: string) => {
    router.push(
      `/site/${id}/topic/${topicId}/query/${queryId}/response/${responseId}`
    );
  };

  return (
    <article>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="pb-4 font-bold text-lg">{query.value}</h2>
      <div className="flex justify-between">
        <h3 className="pb-4 font-bold text-md">Expectations:</h3>
      </div>
      <ul className="mb-4 space-y-2">
        {query.expectations.map((expectation) => (
          <li className="flex gap-2 before:content-['-']" key={expectation.id}>
            {expectation.value}
          </li>
        ))}
        <li>
          <div className="flex">
            <input
              className="px-2 border-2 rounded-l-md w-full"
              placeholder="new expectation"
              value={newExpectation}
              onChange={(e) => setNewExpectation(e.target.value)}
            />
            <button
              className="px-2 rounded-r-md bg-gray-200 hover:bg-gray-300 disabled:hover:bg-gray-200"
              onClick={handleAddExpectation}
              disabled={isLoading || !newExpectation}
            >
              Add
            </button>
          </div>
        </li>
      </ul>
      <h3 className="pb-4 font-bold text-md">Responses:</h3>
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="p-2 border-2">Created on</th>
            <th className="p-2 border-2">Value</th>
            <th className="p-2 border-2">Assessment score</th>
          </tr>
        </thead>
        <tbody>
          {query.responses
            .sort(
              (a, b) =>
                moment(a.timestamp).milliseconds() -
                moment(b.timestamp).milliseconds()
            )
            .map((response) => {
              const score =
                (response.assessments.reduce((acc, curr) => {
                  if (curr.value?.toLowerCase() === "pass") {
                    return acc + 1;
                  }
                  return acc;
                }, 0) /
                  response.assessments.length) *
                100;

              return (
                <tr
                  key={response.id}
                  onClick={() => handleTableRowClick(response.id)}
                  className="cursor-pointer even:bg-gray-100 hover:bg-blue-50 transition duration-150 ease-in-out"
                >
                  <td className="p-2 border-2">
                    {moment(response.timestamp).format("DD/MM/YYYY, HH:mm A")}
                  </td>
                  <td className="p-2 border-2">
                    {response.value.substring(0, 100)}
                    {response.value.length > 100 && "..."}
                  </td>
                  <td className="p-2 border-2">
                    <div className="flex items-center">
                      <div className="flex items-center h-3 flex-1">
                        <div
                          className="h-3 bg-[#22c55e]"
                          style={{
                            width: `${score}%`,
                            borderRadius: "0.375rem",
                            borderBottomRightRadius: `${score !== 100 && "0"}`,
                            borderTopRightRadius: `${score !== 100 && "0"}`,
                          }}
                        ></div>
                        <div
                          className="h-3 bg-[#ef4444]"
                          style={{
                            width: `${100 - score}%`,
                            borderRadius: "0.375rem",
                            borderBottomLeftRadius: `${score !== 0 && "0"}`,
                            borderTopLeftRadius: `${score !== 0 && "0"}`,
                          }}
                        ></div>
                      </div>
                      <span className="min-w-[3rem] text-end">
                        {Math.round(score)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </article>
  );
};

export default Query;
