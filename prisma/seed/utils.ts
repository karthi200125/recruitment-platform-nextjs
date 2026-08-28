import bcrypt from "bcryptjs";

export async function hashPassword(
    password: string
): Promise<string> {
    return bcrypt.hash(password, 10);
}

export function randomItem<T>(items: T[]): T {
    if (items.length === 0) {
        throw new Error("Cannot pick from an empty array.");
    }

    return items[
        Math.floor(Math.random() * items.length)
    ];
}

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

export function randomInt(
    min: number,
    max: number
): number {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

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

export function seedEmail(
    username: string
): string {
    return `${username}@jobify-demo.com`;
}

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

export function randomBoolean(
    probability = 0.5
): boolean {
    return Math.random() < probability;
}