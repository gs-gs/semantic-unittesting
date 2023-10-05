"use client";

import ButtonLink from "@/components/ButtonLink";
import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";

type Props = {
  params: {
    id: string;
  };
};

const Site = ({ params: { id } }: Props) => {
  const { data: site } = useQuery({
    queryKey: [`getSite-${id}`],
    queryFn: () => (id ? sitesAPI.getSite(id) : undefined),
  });

  if (!site) {
    return null;
  }

  return (
    <article>
      <div className="flex items-start justify-between">
        <h2 className="font-bold text-lg mb-4">{site.title}</h2>
        <ButtonLink href={`/site/${site.id}/topic/new`}>Add topic</ButtonLink>
      </div>
      <a href={site.url} className="hover:underline" target="_blank">
        {site.url}
      </a>
    </article>
  );
};

export default Site;
