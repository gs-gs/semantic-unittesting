"use client";

import NavBar from "@/components/NavBar";
import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
  params: { id: string };
};

export const GET_SITE_QUERY_KEY = "getSite";

export default function SiteLayout({ children, params: { id } }: Props) {
  const { data: site } = useQuery({
    queryKey: [GET_SITE_QUERY_KEY],
    queryFn: () => (id ? sitesAPI.getSite(id) : undefined),
  });

  if (!site) {
    return null;
  }

  return (
    <div className="md:grid grid-cols-[16rem_auto]">
      <NavBar topics={site.topics} />
      <div className="p-4">{children}</div>
    </div>
  );
}
