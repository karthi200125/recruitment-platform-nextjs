'use server';

import { meiliClient } from '@/lib/meilisearch';

export async function createJobIndex() {
    try {
        if (meiliClient) {
            await meiliClient.createIndex('jobs', {
                primaryKey: 'id',
            });
        }

        console.log('Jobs index created');
    } catch (error) {
        console.error(error);
    }
}