import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { AboutPage, TeamMember } from "@/types";

interface Props {
  member: AboutPage["frontmatter"]["team"]["members"][number] | TeamMember["frontmatter"];
  index: number;
}

const TeamCard: React.FC<Props> = ({ member, index }) => {

  return (
    <div data-aos="zoom-right-sm" data-aos-delay={index * 150 + 50}>
      <div className="bg-[#d9e8e3] rounded-4xl p-4 pb-0 flex flex-col overflow-hidden">
        <ImageFallback
          src={member.image || "/images/avatar.png"}
          alt={member.name}
          width={400}
          height={400}
          className="w-full mt-auto"
        />
      </div>

      <h3
        className="h6 font-medium mt-4 mb-px"
        dangerouslySetInnerHTML={markdownify(member.name)}
      />
      <p dangerouslySetInnerHTML={markdownify(member.designation)} />
    </div>
  );
};

export default TeamCard;