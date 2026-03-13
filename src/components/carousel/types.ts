export type CarouselRowData = {
  carouselId: string;
  carouselHeading: string;
  carouselSubheading: string;
  carouselDescription: string;
  carouselImageUrl: string;
  carouselImagePublicId: string;
  carouselOrder: number;
  carouselIsPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CarouselFormValues = {
  heading: string;
  subheading: string;
  description: string;
  image: { url: string; publicId: string } | null;
  order: number;
  published: boolean;
};
