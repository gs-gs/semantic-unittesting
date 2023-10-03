import Link from "next/link";

export type Breadcrumb = {
  label: string;
  link?: string;
};

type Props = {
  breadcrumbs: Breadcrumb[];
};

const Breadcrumbs: React.FC<Props> = ({ breadcrumbs }) => {
  return (
    <ul className="flex gap-2 mb-8 list-none text-blue-500">
      {breadcrumbs.map((breadcrumb, i) => (
        <li key={breadcrumb.label} className="flex gap-2">
          <div className="flex items-center gap-2">
            {i > 0 && (
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
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
