export type CategoryOption = {
  categoryBlogId: string;
  categoryBlogName: string;
  categoryBlogSlug: string;
};

export type BlogCardData = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt?: string;
  blogContent: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
  category: { name: string; slug: string } | null;
};

export type BlogDetailData = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogContent: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
  category: { name: string; slug: string } | null;
};
