"use client";

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
      <ul>
        {sites.map((site) => (
          <li key={site.id}>
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
