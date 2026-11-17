import {
  defineSsrMiddleware,
  type SsrRenderRedirectError,
  type SsrRenderRouteNotFoundError,
} from '#q-app';

function isRedirectError(error: unknown): error is SsrRenderRedirectError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'redirectUrl' in error &&
    'redirectHttpStatusCode' in error
  );
}

function isRouteNotFoundError(error: unknown): error is SsrRenderRouteNotFoundError {
  return typeof error === 'object' && error !== null && 'routeNotFound' in error;
}

// This middleware should execute as last one
// since it captures everything and tries to
// render the page with Vue

export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  // we capture any other Express route and hand it
  // over to Vue and Vue Router to render our page
  app.get(resolve.urlPath('{*path}'), async (req, res) => {
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    });

    try {
      const renderedHtml = await render({ req, res, nonce: res.locals.cspNonce as string });
      res.send(renderedHtml);
    } catch (error) {
      if (isRouteNotFoundError(error)) {
        res.status(404).send('404 | Page Not Found');
        return;
      }

      if (isRedirectError(error)) {
        res.redirect(error.redirectHttpStatusCode, error.redirectUrl);
        return;
      }

      if (import.meta.env.QUASAR_DEV) {
        const { errorHeaders, errorHtml } = serve.devError({ err: error, req });
        res.set(errorHeaders).status(500).send(errorHtml);
        return;
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(error instanceof Error ? error.stack : (error ?? 'Unknown error'));
      }

      res.status(500).send('500 | Internal Server Error');
    }
  });
});
