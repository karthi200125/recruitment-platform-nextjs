import bcrypt from "bcryptjs";

/**
 * Hash a password for seeded users.
 *
 * We intentionally use one shared password for development/demo
 * accounts so you can easily log into any seeded account.
 */
export async function hashPassword(
    password: string
): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Pick a random item from an array.
 */
export function randomItem<T>(items: T[]): T {
    if (items.length === 0) {
        throw new Error("Cannot pick from an empty array.");
    }

    return items[
        Math.floor(Math.random() * items.length)
    ];
}

/**
 * Pick multiple unique items from an array.
 */
export function randomItems<T>(
    items: T[],
    count: number
): T[] {
    if (count <= 0) {
        return [];
    }

    if (count >= items.length) {
        return [...items];
    }

    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i],
        ];
    }

    return shuffled.slice(0, count);
}

/**
 * Generate a random integer between min and max.
 */
export function randomInt(
    min: number,
    max: number
): number {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

/**
 * Generate a Date some number of days in the past.
 *
 * Useful for making seeded accounts look naturally created
 * over time instead of all being created on the same day.
 */
export function randomPastDate(
    minDaysAgo: number,
    maxDaysAgo: number
): Date {
    const daysAgo = randomInt(
        minDaysAgo,
        maxDaysAgo
    );

    const date = new Date();

    date.setDate(
        date.getDate() - daysAgo
    );

    return date;
}

/**
 * Generate a deterministic email address for seed data.
 */
export function seedEmail(
    username: string
): string {
    return `${username}@jobify-demo.com`;
}

/**
 * Generate a deterministic username.
 */
export function seedUsername(
    firstName: string,
    lastName: string,
    index: number
): string {
    const first = firstName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const last = lastName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    return `${first}.${last}.${index}`;
}

/**
 * Small helper for selecting a random boolean
 * with a configurable probability.
 *
 * Example:
 * randomBoolean(0.2)
 * → roughly 20% true
 */
export function randomBoolean(
    probability = 0.5
): boolean {
    return Math.random() < probability;
}