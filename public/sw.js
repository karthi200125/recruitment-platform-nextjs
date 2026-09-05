// ─── Jobify Service Worker ────────────────────────────────────────────────────
//
// Caching strategies:
//
// PRECACHE     → essential app shell
// CACHE_FIRST  → static assets
// SWR          → pages and selected API responses
// NETWORK_ONLY → auth / uploads / Stripe / HMR
// OFFLINE      → cached response or offline fallback

const CACHE_VERSION = "v4";

const PRECACHE_NAME = `jobify-precache-${CACHE_VERSION}`;
const STATIC_NAME = `jobify-static-${CACHE_VERSION}`;
const PAGES_NAME = `jobify-pages-${CACHE_VERSION}`;
const API_NAME = `jobify-api-${CACHE_VERSION}`;

const ALL_CACHES = [
    PRECACHE_NAME,
    STATIC_NAME,
    PAGES_NAME,
    API_NAME,
];

const OFFLINE_URL = "/offline";

// ─── App shell ────────────────────────────────────────────────────────────────

const PRECACHE_URLS = [
    OFFLINE_URL,
    "/",
    "/jobs",
    "/signin",
];

// ─── Static assets ────────────────────────────────────────────────────────────

const STATIC_PATTERNS = [
    /\/_next\/static\//,
    /\/fonts\//,
    /\.(?:woff2?|ttf|eot)$/i,
    /\.(?:png|jpg|jpeg|webp|avif|svg|ico|gif)$/i,
];

// ─── API routes that are safe to cache ────────────────────────────────────────

const API_SWR_PATTERNS = [
    /\/api\/jobs(?:\/|$)/,
    /\/api\/companies(?:\/|$)/,
    /\/api\/search(?:\/|$)/,
];

// ─── Routes that must NEVER be cached ─────────────────────────────────────────

const NETWORK_ONLY_PATTERNS = [
    /\/api\/auth(?:\/|$)/,
    /\/api\/stripe(?:\/|$)/,
    /\/api\/upload(?:\/|$)/,
    /\/_next\/webpack-hmr/,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStaticAsset(url) {
    return STATIC_PATTERNS.some((pattern) => pattern.test(url));
}

function isApiSwr(url) {
    return API_SWR_PATTERNS.some((pattern) => pattern.test(url));
}

function isNetworkOnly(url) {
    return NETWORK_ONLY_PATTERNS.some((pattern) => pattern.test(url));
}

function isCacheableResponse(response) {
    return (
        response &&
        response.status === 200 &&
        response.type !== "opaque"
    );
}

/**
 * IMPORTANT:
 * Clone the response BEFORE any other consumer can use its body.
 *
 * Also await cache.put() so the clone is consumed safely.
 */
async function saveToCache(cacheName, request, response) {
    if (!isCacheableResponse(response)) {
        return;
    }

    try {
        const cache = await caches.open(cacheName);

        const responseClone = response.clone();

        await cache.put(request, responseClone);
    } catch (error) {
        console.error(
            "[Jobify SW] Cache write failed:",
            error
        );
    }
}

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(PRECACHE_NAME).then(async (cache) => {
            for (const url of PRECACHE_URLS) {
                try {
                    const response = await fetch(url);

                    if (isCacheableResponse(response)) {
                        await cache.put(url, response);
                    }
                } catch (error) {
                    console.warn(
                        `[Jobify SW] Could not precache ${url}`,
                        error
                    );
                }
            }
        })
    );

    self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter(
                        (key) =>
                            !ALL_CACHES.includes(key)
                    )
                    .map((key) =>
                        caches.delete(key)
                    )
            )
        )
    );

    self.clients.claim();
});

// ─── Fetch router ─────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Only handle HTTP/HTTPS.
    if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
    ) {
        return;
    }

    // Only cache Jobify's own origin.
    if (url.origin !== self.location.origin) {
        return;
    }

    // Never interfere with authentication,
    // uploads, Stripe, or Next.js HMR.
    if (isNetworkOnly(url.pathname)) {
        return;
    }

    // Static assets → Cache First.
    if (isStaticAsset(url.pathname)) {
        event.respondWith(
            cacheFirst(request, STATIC_NAME)
        );
        return;
    }

    // Selected APIs → Stale While Revalidate.
    if (isApiSwr(url.pathname)) {
        event.respondWith(
            staleWhileRevalidate(
                request,
                API_NAME
            )
        );
        return;
    }

    // Browser page navigation → Network First.
    //
    // This is safer for Next.js pages than blindly
    // serving an old page forever.
    if (request.mode === "navigate") {
        event.respondWith(
            navigateNetworkFirst(request)
        );
        return;
    }

    // Other GET requests → Network First.
    event.respondWith(
        networkFirst(
            request,
            PAGES_NAME
        )
    );
});

// ─── Cache First ──────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);

        if (isCacheableResponse(response)) {
            await saveToCache(
                cacheName,
                request,
                response
            );
        }

        return response;
    } catch {
        return offlineFallback(request);
    }
}

// ─── Stale While Revalidate ───────────────────────────────────────────────────

async function staleWhileRevalidate(
    request,
    cacheName
) {
    const cache = await caches.open(cacheName);

    const cached = await cache.match(request);

    const networkPromise = fetch(request)
        .then(async (response) => {
            if (isCacheableResponse(response)) {
                await saveToCache(
                    cacheName,
                    request,
                    response
                );
            }

            return response;
        })
        .catch(() => null);

    if (cached) {
        // User gets cached response immediately.
        // Network updates cache in background.
        return cached;
    }

    // Nothing cached — wait for network.
    const networkResponse = await networkPromise;

    if (networkResponse) {
        return networkResponse;
    }

    return offlineFallback(request);
}

// ─── Navigation: Network First ───────────────────────────────────────────────

async function navigateNetworkFirst(request) {
    try {
        const response = await fetch(request);

        if (isCacheableResponse(response)) {
            await saveToCache(
                PAGES_NAME,
                request,
                response
            );
        }

        return response;
    } catch {
        const cached = await caches.match(request);

        if (cached) {
            return cached;
        }

        return offlineFallback(request);
    }
}

// ─── Network First ────────────────────────────────────────────────────────────

async function networkFirst(
    request,
    cacheName
) {
    try {
        const response = await fetch(request);

        if (isCacheableResponse(response)) {
            await saveToCache(
                cacheName,
                request,
                response
            );
        }

        return response;
    } catch {
        const cached = await caches.match(request);

        if (cached) {
            return cached;
        }

        return offlineFallback(request);
    }
}

// ─── Offline fallback ─────────────────────────────────────────────────────────

async function offlineFallback(request) {
    // Page navigation → offline page.
    if (request.mode === "navigate") {
        const offline = await caches.match(
            OFFLINE_URL
        );

        if (offline) {
            return offline;
        }
    }

    // API → JSON response.
    if (
        request.headers
            .get("Accept")
            ?.includes("application/json")
    ) {
        return new Response(
            JSON.stringify({
                error: "You are offline.",
                offline: true,
            }),
            {
                status: 503,
                headers: {
                    "Content-Type":
                        "application/json",
                },
            }
        );
    }

    return new Response(
        "You are offline.",
        {
            status: 503,
            headers: {
                "Content-Type":
                    "text/plain",
            },
        }
    );
}

// ─── Background sync ──────────────────────────────────────────────────────────

self.addEventListener("sync", (event) => {
    if (event.tag === "jobify-sync") {
        event.waitUntil(
            replayQueuedRequests()
        );
    }
});

async function replayQueuedRequests() {
    const clients =
        await self.clients.matchAll({
            type: "window",
        });

    for (const client of clients) {
        client.postMessage({
            type: "SYNC_COMPLETE",
            tag: "jobify-sync",
        });
    }
}

// ─── Push notifications ──────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
    if (!event.data) {
        return;
    }

    let data = {
        title: "Jobify",
        body: "You have a new notification.",
    };

    try {
        data = event.data.json();
    } catch {
        data.body = event.data.text();
    }

    event.waitUntil(
        self.registration.showNotification(
            data.title ?? "Jobify",
            {
                body:
                    data.body ??
                    "You have a new notification.",

                icon: "/icons/icon-192.png",

                badge:
                    "/icons/badge-72.png",

                vibrate: [
                    100,
                    50,
                    100,
                ],

                data: {
                    url:
                        data.url ??
                        "/",
                },

                actions:
                    data.actions ?? [],
            }
        )
    );
});

// ─── Notification click ──────────────────────────────────────────────────────

self.addEventListener(
    "notificationclick",
    (event) => {
        event.notification.close();

        const target =
            event.notification.data?.url ??
            "/";

        event.waitUntil(
            self.clients
                .matchAll({
                    type: "window",
                    includeUncontrolled: true,
                })
                .then((clients) => {
                    const existing =
                        clients.find(
                            (client) =>
                                client.url.includes(
                                    target
                                )
                        );

                    if (existing) {
                        return existing.focus();
                    }

                    return self.clients.openWindow(
                        target
                    );
                })
        );
    }
);

// ─── Messages from application ────────────────────────────────────────────────

self.addEventListener("message", (event) => {
    if (!event.data?.type) {
        return;
    }

    switch (event.data.type) {
        case "SKIP_WAITING":
            self.skipWaiting();
            break;

        case "CLEAR_CACHE":
            event.waitUntil(
                caches.delete(
                    event.data.cacheName ??
                    PAGES_NAME
                )
            );
            break;
    }
});