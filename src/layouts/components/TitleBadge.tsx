"use client";

import DynamicIcon from "@/helpers/DynamicIcon";
import { usePathname } from "next/navigation";


interface TitleBadgeProps {
  icon?: string;
  bg_color?: string;
  label: string;
  isCenter?: boolean;
}

const TitleBadge: React.FC<TitleBadgeProps> = ({
  icon,
  bg_color: bgColor,
  label,
  isCenter = true,
}) => {
  const pathname = usePathname();

  return (
    <div
      className={`flex ${isCenter ? "justify-center" : ""} ${!pathname.includes("blog") && !pathname.includes("programs") ? "max-lg:justify-center" : ""}`}
    >
      <div
        className={`flex w-max items-center justify-center gap-2 ${icon ? "pr-4" : "px-4"} rounded-full border border-border bg-body`}
      >
        {
          icon && (
            <div
              className={`flex items-center justify-center p-2 rounded-full ${bgColor || "bg-primary"}`}
            >
              <DynamicIcon icon={icon} className="text-white text-sm" />
            </div>
          )
        }
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
    </div>
  );
};

export default TitleBadge;