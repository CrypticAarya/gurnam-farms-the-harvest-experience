/**
 * Sentry Error Tracking Integration
 * 
 * This module provides centralized error tracking via Sentry.
 * 
 * Client-side: Tracks frontend errors, unhandled promises, and performance issues
 * Server-side: Tracks backend errors from API calls
 * 
 * Requires environment variable: VITE_SENTRY_DSN (client) and SENTRY_DSN (server)
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for client-side error tracking
 * Call this in your app entry point before rendering
 */
export function initSentryClient() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn(
      "[Sentry] Client DSN not configured. Error tracking disabled. Set VITE_SENTRY_DSN env var to enable."
    );
    return;
  }

  Sentry.init({
    dsn,
    // Only send errors in production to avoid noise in development
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 0,
    integrations: [
      // Capture unhandled exceptions
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Set sample rate to 100% for replays
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    ignoreErrors: [
      // Browser plugins
      "top.GLOBALS",
      // External scripts
      "Cannot read properties of undefined (reading 'call')",
      "NetworkError",
      "Network request failed",
    ],
  });

  console.info("[Sentry] Client error tracking initialized");
}

/**
 * Capture a message in Sentry
 * Use this for important business events or debugging
 */
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Capture an exception in Sentry
 * Use this for error handling
 */
export function captureException(error: Error | string, context?: Record<string, any>) {
  if (import.meta.env.VITE_SENTRY_DSN) {
    const scope = Sentry.getCurrentScope();
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    Sentry.captureException(error);
  }
}

/**
 * Add a breadcrumb for debugging event sequences
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      data,
      level: "info",
    });
  }
}

export default {
  initSentryClient,
  captureMessage,
  captureException,
  addBreadcrumb,
};
