
import { AccordionProvider } from "@/shortcodes/Accordion";
import shortcodes from "@/shortcodes/all";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const MDXContent = ({ content }: { content: any }) => {
  interface IMdxOptions {
    remarkPlugins?: any[];
    rehypePlugins?: any[];
  }
  const mdxOptions: IMdxOptions = {
    remarkPlugins: [remarkGfm],
  };

  return (
    <AccordionProvider>
      {/* @ts-ignore */}
      <MDXRemote
        source={content}
        components={shortcodes}
        options={{ mdxOptions }}
      />
    </AccordionProvider>
  );
};

export default MDXContent;