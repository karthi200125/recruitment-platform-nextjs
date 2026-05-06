'use server';

import { meiliClient } from '@/lib/meilisearch';

export async function configureJobIndex() {
    const index = meiliClient.index('jobs');

    // Searchable fields
    await index.updateSearchableAttributes([
        'jobTitle',
        'jobDesc',
        'skills',
        'companyName',
        'city',
        'state',
        'country',
    ]);

    // Filterable fields
    await index.updateFilterableAttributes([
        'city',
        'state',
        'country',
        'type',
        'mode',
        'experience',
        'isEasyApply',
    ]);

    // Sortable
    await index.updateSortableAttributes([
        'createdAt',
    ]);

    // Ranking
    await index.updateRankingRules([
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
    ]);

    console.log('Meilisearch configured');
}