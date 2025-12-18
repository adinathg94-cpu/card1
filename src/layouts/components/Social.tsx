
import DynamicIcon from "@/helpers/DynamicIcon";
import Link from "next/link";

interface Props {
  source: { name: string; link: string; icon: string }[];
  className: string;
}

const Social = ({ source, className }: Props) => {
  return (
    <ul className={className}>
      {source.map((social, index) => (
        <li key={index}>
          <Link
            aria-label={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <span className="sr-only">{social.name}</span>
            <DynamicIcon className="inline-block" icon={social.icon} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Social;