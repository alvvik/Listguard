import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    let query = db.select().from(applications);

    if (status) {
      query = query.where(eq(applications.status, status)) as typeof query;
    }

    const response = await query.limit(limit);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json("We cant do your request", { status: 500 });
  }
}
