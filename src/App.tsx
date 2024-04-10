import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const Editor = lazy(() => import('~/Editor'));
const Viewer = lazy(() => import('~/Viewer'));

export const App = (): JSX.Element => (
  <BrowserRouter>
    <Suspense fallback={<></>}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route
          path="*"
          element={
            <Navigate
              to={`/editor${
                window.location.hash !== '#' ? window.location.hash : ''
              }`}
            />
          }
        />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
