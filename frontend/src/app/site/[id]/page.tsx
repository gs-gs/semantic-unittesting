"use client";

import { sitesAPI } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const Site = ({ params: { id } }: Props) => {
  const router = useRouter();
  const { data: site } = useQuery({
    queryKey: [`getSite-${id}`],
    queryFn: () => (id ? sitesAPI.getSite(id) : undefined),
  });
  const { mutate } = useMutation({
    mutationFn: () => sitesAPI.evaluateSite(id),
    onSuccess: (data) => {
      router.push(`/site/${id}/job/${data.id}`);
    },
  });

  const handleEvaluateSite = () => {
    mutate();
  };

  if (!site) {
    return null;
  }

  return (
    <article>
      <div className="flex items-start justify-between">
        <h2 className="font-bold text-lg mb-4">{site.title}</h2>
        <button
          className="flex items-center px-4 py-2 rounded-md font-bold bg-green-500 hover:bg-green-600 text-white"
          onClick={handleEvaluateSite}
        >
          Evaluate
        </button>
      </div>
      <a href={site.url} className="hover:underline" target="_blank">
        {site.url}
      </a>
      <iframe
        src="http://localhost:5601/app/dashboards#/view/650373a0-52b4-11ee-83a8-55b334a86bf6?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15d,to:now))&_a=()"
        height="500"
        width="100%"
      ></iframe>
    </article>
  );
};

export default Site;
