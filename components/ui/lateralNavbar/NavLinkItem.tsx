import Link from "next/link";
import React from "react";

interface NavLinkItemProps {
  href: string;
  Icon?: React.ComponentType;
  label: string;
}

const NavLinkItem = ({ href, Icon, label }: NavLinkItemProps) => {
  return (
    <div>
      <Link
        href={href}
        className="flex justify-start items-center gap-2 px-5 py-2 hover:bg-blue-100 font-light text-sm transition"
      >
        {Icon && <Icon />}
        {label}
      </Link>
    </div>
  );
};

export default NavLinkItem;
