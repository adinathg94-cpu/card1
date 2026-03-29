import CallToActionSecondary from "@/partials/CallToActionSecondary";
import PostSingleClient from "./PostSingleClient";

const PostSingle = async ({ params }: { params: Promise<{ single: string }> }) => {
  const { single } = await params;

  return (
    <>
      <PostSingleClient single={single} />
      <CallToActionSecondary isNoSectionTop={true} />
    </>
  );
};

export default PostSingle;