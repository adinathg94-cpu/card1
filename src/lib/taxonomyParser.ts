import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Get taxonomies from content
export const getTaxonomy = (folder: string, name: string) => {
  const taxonomyPath = path.join(process.cwd(), "content", folder);
  const taxonomyFiles = fs.readdirSync(taxonomyPath);
  const taxonomies = taxonomyFiles.filter((file) => file.endsWith(".md")).map((file) => {
    const content = fs.readFileSync(path.join(taxonomyPath, file), "utf-8");
    const { data } = matter(content);
    return data[name] ? data[name] : "";
  });
  
  return [...new Set(taxonomies.flat())];
};

// Get taxonomies with details
export const getTaxonomyWithDetails = (folder: string) => {
  const taxonomyPath = path.join(process.cwd(), "content", folder);
  const taxonomyFiles = fs.readdirSync(taxonomyPath);
  
  const taxonomies = taxonomyFiles.filter((file) => file !== "_index.md" && file.endsWith(".md")).map((file) => {
    const content = fs.readFileSync(path.join(taxonomyPath, file), "utf-8");
    const { data } = matter(content);
    
    return {
      frontmatter: data,
      slug: file.replace(".md", ""),
    };
  });
  
  return taxonomies;
};