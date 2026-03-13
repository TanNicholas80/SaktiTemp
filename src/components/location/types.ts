export type LocationCardData = {
  locationId: string;
  locationCity: string;
  locationType: "branch" | "head";
  locationAddress: string;
  locationMapUrl: string;
  locationMapEmbedUrl: string;
  locationIsPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LocationDetailData = LocationCardData;
