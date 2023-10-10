"use client";

import ButtonLink, { ColorScheme } from "@/components/ButtonLink";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { sitesAPI } from "@/services";
import { useRouter } from "next/navigation";
import { GET_SITE_QUERY_KEY } from "../../layout";

type Props = {
  params: { id: string };
};

const NewTopic = ({ params: { id } }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: () => sitesAPI.newTopic({ title, site_id: id }),
    onSuccess: (data) => {
      queryClient.invalidateQueries([GET_SITE_QUERY_KEY]);
      router.replace(`/site/${id}/topic/${data.id}`);
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="p-4">
      <h2 className="pb-8 font-bold text-lg">New Topic</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label className="min-w-[5rem] font-bold" htmlFor="title">
            Title<sup>*</sup>
          </label>
          <input
            id="title"
            className="flex-1 border-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <ButtonLink href={`/site/${id}`} colorScheme={ColorScheme.GREY}>
            Cancel
          </ButtonLink>
          <button
            type="submit"
            disabled={isLoading}
            className="flex bg-green-500 hover:bg-green-600 text-white items-center px-4 py-2 rounded-md font-bold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTopic;
