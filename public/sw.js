// ─── Jobify Service Worker ────────────────────────────────────────────────────
// Caching strategies:
//
// PRECACHE    → app shell (offline page, logo, fonts)
// CACHE_FIRST → static assets (JS/CSS/images/fonts) — immutable, serve from cache
// SWR         → pages & API responses — serve cache instantly, revalidate in bg
// NETWORK_ONLY→ auth, POST/PATCH/DELETE — never cache
// OFFLINE     → fallback when network + cache both fail

const CACHE_VERSION   = "v3";
const PRECACHE_NAME   = `jobify-precache-${CACHE_VERSION}`;
const STATIC_NAME     = `jobify-static-${CACHE_VERSION}`;
const PAGES_NAME      = `jobify-pages-${CACHE_VERSION}`;
const API_NAME        = `jobify-api-${CACHE_VERSION}`;

const ALL_CACHES      = [PRECACHE_NAME, STATIC_NAME, PAGES_NAME, API_NAME];
const OFFLINE_URL     = "/offline";

// Pages cached for instant offline access
const PRECACHE_URLS   = [
    OFFLINE_URL,
    "/",
    "/jobs",
    "/signin",
];

// Static assets — immutable (Next.js adds content hash to filename)
const STATIC_PATTERNS = [
    /\/_next\/static\//,
    /\/fonts\//,
    /\.(?:woff2?|ttf|eot)$/,
    /\.(?:png|jpg|jpeg|webp|avif|svg|ico|gif)$/,
];

// API routes — stale-while-revalidate
const API_SWR_PATTERNS = [
    /\/api\/jobs/,
    /\/api\/companies/,
    /\/api\/search/,
];

// Routes that must never be cached
const NETWORK_ONLY_PATTERNS = [
    /\/api\/auth/,
    /\/_next\/webpack-hmr/,
    /\/api\/stripe/,
    /\/api\/upload/,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStaticAsset(url) {
    return STATIC_PATTERNS.some((p) => p.test(url));
}

function isApiSwr(url) {
    return API_SWR_PATTERNS.some((p) => p.test(url));
}

function isNetworkOnly(url) {
    return NETWORK_ONLY_PATTERNS.some((p) => p.test(url));
}

function isNavigate(request) {
    return request.mode === "navigate";
}

function isCacheableResponse(response) {
    return response && response.status === 200 && response.type !== "opaque";
}

function cacheResponse(cacheName, request, response) {
    if (!isCacheableResponse(response)) return;
    caches.open(cacheName).then((cache) => cache.put(request, response.clone()));
}

// ─── Install: precache app shell ──────────────────────────────────────────────

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(PRECACHE_NAME).then((cache) =>
            cache.addAll(PRECACHE_URLS)
        )
    );
    // Activate immediately — don't wait for old SW to die
    self.skipWaiting();
});

// ─── Activate: purge stale caches ────────────────────────────────────────────

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => !ALL_CACHES.includes(k))
                    .map((k) => caches.delete(k))
            )
        )
    );
    // Take control of all open tabs without a reload
    self.clients.claim();
});

// ─── Fetch: strategy router ───────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const { url }     = request;

    // Only intercept GET over HTTP/S
    if (request.method !== "GET") return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) return;

    // 1. Never cache: auth / mutations / HMR
    if (isNetworkOnly(url)) return;

    // 2. Static assets → Cache-First (immutable)
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request, STATIC_NAME));
        return;
    }

    // 3. API routes → Stale-While-Revalidate
    if (isApiSwr(url)) {
        event.respondWith(staleWhileRevalidate(request, API_NAME));
        return;
    }

    // 4. Page navigations → Stale-While-Revalidate with offline fallback
    if (isNavigate(request)) {
        event.respondWith(navigateSwr(request));
        return;
    }

    // 5. Everything else → Network-first with cache fallback
    event.respondWith(networkFirst(request, PAGES_NAME));
});

// ─── Strategy: Cache-First ────────────────────────────────────────────────────
// Serve from cache immediately. If not cached, fetch + store.
// Ideal for versioned static assets (JS, CSS, fonts, images).

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        cacheResponse(cacheName, request, response);
        return response;
    } catch {
        return offlineFallback(request);
    }
}

// ─── Strategy: Stale-While-Revalidate ────────────────────────────────────────
// Serve cached version instantly. Simultaneously fetch fresh copy in the bg.
// Ideal for API responses and pages — users see content immediately.

async function staleWhileRevalidate(request, cacheName) {
    const cache  = await caches.open(cacheName);
    const cached = await cache.match(request);

    // Fire network request regardless — update cache in background
    const networkPromise = fetch(request).then((response) => {
        cacheResponse(cacheName, request, response);
        return response;
    }).catch(() => null);

    // Return cached immediately; otherwise wait for network
    return cached ?? networkPromise ?? offlineFallback(request);
}

// ─── Strategy: Navigate SWR ──────────────────────────────────────────────────
// Same as SWR but with offline page fallback for page navigations.

async function navigateSwr(request) {
    const cache  = await caches.open(PAGES_NAME);
    const cached = await cache.match(request);

    const networkPromise = fetch(request).then((response) => {
        cacheResponse(PAGES_NAME, request, response);
        return response;
    }).catch(() => null);

    return cached ?? networkPromise ?? caches.match(OFFLINE_URL) ?? offlineFallback(request);
}

// ─── Strategy: Network-First ──────────────────────────────────────────────────
// Try network first; fall back to cache if offline.
// Ideal for dynamic pages that should always be fresh.

async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        cacheResponse(cacheName, request, response);
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached ?? offlineFallback(request);
    }
}

// ─── Offline fallback ─────────────────────────────────────────────────────────

async function offlineFallback(request) {
    if (request.mode === "navigate") {
        const offline = await caches.match(OFFLINE_URL);
        if (offline) return offline;
    }

    // JSON fallback for API requests
    if (request.headers.get("Accept")?.includes("application/json")) {
        return new Response(
            JSON.stringify({ error: "You are offline.", offline: true }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response("You are offline.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
    });
}

// ─── Background sync — retry failed POST/PATCH/DELETE when back online ────────

self.addEventListener("sync", (event) => {
    if (event.tag === "jobify-sync") {
        event.waitUntil(replayQueuedRequests());
    }
});

async function replayQueuedRequests() {
    // Notify all tabs that connectivity is restored
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) =>
        client.postMessage({ type: "SYNC_COMPLETE", tag: "jobify-sync" })
    );
}

// ─── Push notifications ───────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
    if (!event.data) return;

    let data = { title: "Jobify", body: "You have a new notification." };

    try {
        data = event.data.json();
    } catch {
        data.body = event.data.text();
    }

    event.waitUntil(
        self.registration.showNotification(data.title ?? "Jobify", {
            body:    data.body,
            icon:    "/icons/icon-192.png",
            badge:   "/icons/badge-72.png",
            vibrate: [100, 50, 100],
            data:    { url: data.url ?? "/" },
            actions: data.actions ?? [],
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const target = event.notification.data?.url ?? "/";

    event.waitUntil(
        self.clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clients) => {
                // Focus an existing tab if one is open
                const existing = clients.find((c) => c.url.includes(target));
                if (existing) return existing.focus();
                return self.clients.openWindow(target);
            })
    );
});

// ─── Message handler — allow pages to send commands ──────────────────────────

self.addEventListener("message", (event) => {
    if (!event.data?.type) return;

    switch (event.data.type) {
        // Force skip waiting from the app (useful after update prompt)
        case "SKIP_WAITING":
            self.skipWaiting();
            break;

        // Clear a specific cache from the app
        case "CLEAR_CACHE":
            caches.delete(event.data.cacheName ?? PAGES_NAME);
            break;
    }
});