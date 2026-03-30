import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryProduct } from "@/db/schema/category-product";
import { contact } from "@/db/schema/contact";
import { socialMedia } from "@/db/schema/social-media";
import {
  applyContactTranslations,
  applyCategoryProductTranslations,
} from "@/lib/translate/get-translated";
import type { ContactOutput, CategoryProductOutput } from "@/lib/translate";

type SocialMediaItem = {
  socialMediaId: string;
  platformName: string;
  profileUrl: string;
  iconName: string;
};

export type FooterData = {
  contacts: ContactOutput[];
  categories: CategoryProductOutput[];
  socialMedia: SocialMediaItem[];
};

export async function getFooterData(locale: string): Promise<FooterData> {
  const [contactRows, categoryRows, socialMediaRows] = await Promise.all([
    db.query.contact.findMany({
      columns: {
        contactId: true,
        contactType: true,
        contactLabel: true,
        contactValue: true,
        contactValueExtra: true,
        contactIcon: true,
      },
      where: eq(contact.isPublished, true),
    }),
    db.query.categoryProduct.findMany({
      columns: {
        categoryProductId: true,
        categoryProductName: true,
        categoryProductSlug: true,
      },
    }),
    db.query.socialMedia.findMany({
      columns: {
        socialMediaId: true,
        platformName: true,
        profileUrl: true,
        iconName: true,
      },
      where: eq(socialMedia.isPublished, true),
    }),
  ]);

  const [contacts, categories] = await Promise.all([
    applyContactTranslations(contactRows, locale),
    applyCategoryProductTranslations(categoryRows, locale),
  ]);

  return {
    contacts,
    categories,
    socialMedia: socialMediaRows.map((r) => ({
      socialMediaId: r.socialMediaId,
      platformName: r.platformName,
      profileUrl: r.profileUrl,
      iconName: r.iconName,
    })),
  };
}
