const NotFoundPage = () => <p>404 — Page not found</p>;

export const errorRoutes = [{ path: '*', element: <NotFoundPage /> }];
