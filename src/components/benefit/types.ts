export type BenefitCardData = {
  benefitId: string;
  benefitName: string;
  benefitDescription: string;
  benefitIcon: string;
  benefitIsPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BenefitDetailData = BenefitCardData;
