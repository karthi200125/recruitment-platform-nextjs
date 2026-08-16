export const dynamic = "force-dynamic";

import { searchJobSuggestions } from "@/actions/searchJobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") ?? "";
        const location = searchParams.get("location") ?? "";

        if (!query.trim() && !location.trim()) {
            return NextResponse.json([]);
        }
        
        const results = await searchJobSuggestions(query, location);

        return NextResponse.json(results);
    } catch (error) {
        console.error("[GET /api/jobs/search]", error);
        return NextResponse.json(
            { success: false, message: "Search failed" },
            { status: 500 }
        );
    }
}