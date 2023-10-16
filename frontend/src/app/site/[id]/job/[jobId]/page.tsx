"use client";

import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";
import { useJobStream } from "@/utils/hooks";
import { BounceLoader, MoonLoader } from "react-spinners";
import { useEffect, useMemo } from "react";
import { Response } from "@/services/types";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
    jobId: string;
  };
};

const Job = ({ params: { id, jobId } }: Props) => {
  const router = useRouter();
  const { data: job } = useQuery({
    queryKey: [`getJob-${jobId}`],
    queryFn: () => (jobId ? sitesAPI.getJob(jobId) : undefined),
  });

  const { assessments, setAssessments } = useJobStream({
    jobId,
    initialAssessments: job?.assessments || [],
  });

  const loading = useMemo(() => {
    if (job) {
      const completedAssessments = assessments.filter((a) => a.value);
      return completedAssessments.length < job?.numOfAssessments;
    }
    return true;
  }, [assessments, job]);

  useEffect(() => {
    if (job) {
      setAssessments(job.id, job.assessments);
    }
  }, [job, setAssessments]);

  if (!job) {
    return null;
  }

  const breadcrumbs: Breadcrumb[] = [
    {
      label: job.site.title,
      link: `/site/${id}`,
    },
    {
      label: moment(job.started_on).format("DD MMMM YYYY, HH:mm A"),
    },
  ];

  const handleTableRowClick = (response: Response) => {
    router.push(
      `/site/${id}/topic/${response.query.topic.id}/query/${response.query.id}/response/${response.id}`
    );
  };

  return (
    <article>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="pb-4 font-bold text-lg">
        {moment(job.started_on).format("DD MMMM YYYY, HH:mm A")}
      </h2>
      <div className="pb-2 flex items-center gap-4">
        {loading ? "Assessing responses" : "Assessment complete"}
        {loading && <MoonLoader color="gray" size={16} />}
      </div>
      <div className="ml-4 font-bold">
        <div className="pb-2 flex items-center gap-4">
          <span className="min-w-[8rem]">Total completed</span>
          <span>{`${assessments.filter((a) => a.value).length}/${
            job.numOfAssessments
          }`}</span>
        </div>
        <div className="pb-2 flex items-center gap-4 text-[#22c55e]">
          <span className="min-w-[8rem]">Passed</span>
          <span>{`${
            assessments.filter(
              (a) => a.value && a.value.toLowerCase() === "pass"
            ).length
          }/${job.numOfAssessments}`}</span>
        </div>
        <div className="pb-2 flex items-center gap-4 text-[#ef4444]">
          <span className="min-w-[8rem]">Failed</span>
          <span>{`${
            assessments.filter(
              (a) => a.value && a.value.toLowerCase() === "fail"
            ).length
          }/${job.numOfAssessments}`}</span>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-gray-200">
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="p-2 border-2">Topic</th>
            <th className="p-2 border-2">Query</th>
            <th className="p-2 border-2">Expectation</th>
            <th className="p-2 border-2">Assessment</th>
          </tr>
        </thead>
        <tbody>
          {assessments
            .sort(
              (a, b) =>
                a.response.query.topic.title.localeCompare(
                  b.response.query.topic.title
                ) ||
                a.response.query.value.localeCompare(b.response.query.value)
            )
            .map((a) => (
              <tr
                key={a.id}
                onClick={() => handleTableRowClick(a.response)}
                className="cursor-pointer even:bg-gray-100 hover:bg-blue-50 transition duration-150 ease-in-out"
              >
                <td className="p-2 border-2">{a.response.query.topic.title}</td>
                <td className="p-2 border-2">{a.response.query.value}</td>
                <td className="p-2 border-2">{a.expectation.value}</td>
                <td className="p-2 border-2 gap-2 text-center">
                  {a.value ? (
                    <span className="flex justify-center">
                      <div
                        className="w-4 h-4 rounded-lg"
                        style={{
                          backgroundColor:
                            a.value.toLowerCase() === "pass"
                              ? "#22c55e"
                              : a.value.toLowerCase() === "fail"
                              ? "#ef4444"
                              : "#fbbf24",
                        }}
                      ></div>
                    </span>
                  ) : (
                    <span className="flex justify-center">
                      <BounceLoader color="gray" size={16} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </article>
  );
};

export default Job;
