import { NextResponse } from "next/server";

import { getFooterData } from "@/lib/footer/get-footer-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") ?? "id";
    const safeLocale = locale === "en" || locale === "zh" || locale === "id" ? locale : "id";
    const data = await getFooterData(safeLocale);
    return NextResponse.json(data);
  } catch (error) {
    console.error("footer route error:", error);
    return NextResponse.json(
      { contacts: [], categories: [], socialMedia: [] },
      { status: 200 }
    );
  }
}

