import Link from "next/link";

import SvgChevron from "@/assets/chevron-right.svg";

export type Breadcrumb = {
  label: string;
  link?: string;
};

type Props = {
  breadcrumbs: Breadcrumb[];
};

const Breadcrumbs: React.FC<Props> = ({ breadcrumbs }) => {
  return (
    <ul className="flex flex-wrap gap-2 mb-8 list-none text-blue-500">
      {breadcrumbs.map((breadcrumb, i) => (
        <li key={breadcrumb.label} className="flex gap-2">
          <div className="max-w-max flex items-center gap-2">
            {i > 0 && (
              <span className="text-slate-500">
                <SvgChevron width="16px" height="16px" />
              </span>
            )}
            {breadcrumb.link ? (
              <Link href={breadcrumb.link} className="hover:underline">
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-black">{breadcrumb.label}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;
