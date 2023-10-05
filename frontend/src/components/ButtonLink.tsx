import Link from "next/link";
import { ReactNode } from "react";

export enum ColorScheme {
  GREEN,
  GREY,
  RED,
}

type ColorSchemeClasses = {
  [key in ColorScheme]: string;
};

const colorSchemeClasses: ColorSchemeClasses = {
  [ColorScheme.GREEN]: "bg-green-500 hover:bg-green-600 text-white",
  [ColorScheme.GREY]: "bg-slate-300 hover:bg-slate-400 text-black",
  [ColorScheme.RED]: "bg-red-500 hover:bg-red-600 text-white",
};

type Props = {
  children: ReactNode;
  colorScheme?: ColorScheme;
  href: string;
};

const ButtonLink: React.FC<Props> = ({
  colorScheme = ColorScheme.GREEN,
  children,
  href,
}) => {
  return (
    <Link
      className={`flex items-center px-4 py-2 ${colorSchemeClasses[colorScheme]} rounded-md font-bold`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
