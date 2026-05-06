import { NextRequest, NextResponse } from 'next/server';
import { meiliClient } from '@/lib/meilisearch';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const query = searchParams.get('q') || '';
        const location = searchParams.get('location') || '';

        const index = meiliClient.index('jobs');

        const filters = [];

        if (location) {
            filters.push(`city = "${location}"`);
        }

        const results = await index.search(query, {
            filter: filters.length ? filters : undefined,

            limit: 10,
        });

        return NextResponse.json(results.hits);

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: 'Search failed',
            },
            {
                status: 500,
            }
        );
    }
}