/**
 * an array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/api/uploadthing",
    "/task/:id",
    "/ai-recommend",
    "/task/:id/focus-timer",
    "/test",
    "/auth/forgot-password",
    "/failed",
    "/success",
];

/**
 * an array of routes that are used for authentication
 * these routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/social/login/redirect"
];

/**
 * The prefix for API authentication routes
 * Routes that starts with this prefix are used for API authentication purposes
 * @type {string[]}
 */
export const apiAuthPrefix = "/api/auth";


/**
 * The default redirect path after logging in
 * @type {string[]}
 */
export const DEFAULT_LOGIN_REDIRECT = "/tasks"

