"use client";

import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";

type Props = {
  params: {
    id: string;
  };
};

const Site = ({ params: { id } }: Props) => {
  const { data: site } = useQuery({
    queryKey: ["getSite"],
    queryFn: () => (id ? sitesAPI.getSite(id) : undefined),
  });

  if (!site) {
    return null;
  }

  return (
    <article>
      <h2 className="font-bold text-lg mb-4">{site.title}</h2>
      <a href={site.url} className="hover:underline" target="_blank">
        {site.url}
      </a>
    </article>
  );
};

export default Site;
