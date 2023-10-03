import Link from "next/link";
import { Topic } from "../services/types";

type Props = {
  topics: Topic[];
};

const NavBar: React.FC<Props> = ({ topics }) => {
  return (
    <nav className="md:sticky md:top-0 md:h-screen">
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-100">
        <ul className="space-y-2 font-medium">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/site/${topic.site.id}/topic/${topic.id}`}
                className="flex items-center p-2 text-gray-900 rounded-lg border border-blue-100 hover:border-blue-300 group"
              >
                {topic.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
