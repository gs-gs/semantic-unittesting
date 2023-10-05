"use client";

import ButtonLink from "@/components/ButtonLink";
import { sitesAPI } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const { data: sites, isFetching } = useQuery({
    queryKey: ["getSites"],
    queryFn: () => sitesAPI.getSites(),
  });

  if (isFetching || !sites) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <h2 className="mb-8 font-bold text-lg">Sites</h2>
        <ButtonLink href="/site/new">Add site</ButtonLink>
      </div>
      <ul>
        {sites.map((site) => (
          <li key={site.id} className="flex gap-2 italic before:content-['-']">
            <Link
              href={`/site/${site.id}`}
              className="shrink-[4] hover:underline"
            >
              <h3>{site.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
