"use client";

import ButtonLink, { ColorScheme } from "@/components/ButtonLink";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { sitesAPI } from "@/services";
import { useRouter } from "next/navigation";

type Props = {
  params: { id: string; topicId: string };
};

const NewQuery = ({ params: { id, topicId } }: Props) => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: () => sitesAPI.newQuery({ value, topic_id: topicId }),
    onSuccess: (data) => {
      router.replace(`/site/${id}/topic/${topicId}/query/${data.id}`);
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="p-4">
      <h2 className="pb-8 font-bold text-lg">New Query</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label className="min-w-[5rem] font-bold" htmlFor="value">
            Value<sup>*</sup>
          </label>
          <input
            id="value"
            className="flex-1 border-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <ButtonLink href="/" colorScheme={ColorScheme.GREY}>
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

export default NewQuery;
