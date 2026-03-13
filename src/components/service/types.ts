export type ServiceCardData = {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceIcon: string;
  serviceIsPublished: boolean;
  servicePoints: string[];
  serviceBtnText: string;
  serviceBtnLink: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ServiceDetailData = ServiceCardData;
