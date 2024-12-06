import Link from "next/link";

interface NavLinkHeaderProps {
  Icon?: React.ComponentType;
  title: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavLinkHeader = ({ Icon, active, href, onClick, title }: NavLinkHeaderProps) => {
  return(
    <Link href={href} className={`border text-sm rounded-lg border-transparent px-2 py-1  text-gray-600 hover:text-blue-400 hover:bg-blue-50 transition`} onClick={onClick}>
      {Icon && <Icon />}
      {title}
    </Link>
  )
}

export default NavLinkHeader;