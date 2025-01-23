import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import { decompress } from './compression';
import Editor from './Editor';

const DarkTheme = lazy(() => import('./DarkTheme'));

export const App = (): JSX.Element => {
  const swaggerRef = useRef<string | object | undefined>({});
  const [, render] = useState(false);
  const [mode, setMode] = useState('view');

  const searchParams = new URLSearchParams(window.location.search);
  const readonly = searchParams.get('readonly') === 'true';
  const isDark = searchParams.get('theme') === 'dark';
  const bgColor = searchParams.get('bg') ?? undefined;

  useEffect(() => {
    let hash = window.location.hash;

    if (hash.startsWith('#')) {
      hash = hash.slice(1);
    }

    if (hash !== '') {
      decompress(hash)
        .then(decompressed => {
          swaggerRef.current = JSON.parse(decompressed) as object;
          render(val => !val);
        })
        .catch(console.error);
    }
  }, [render]);

  return (
    <Suspense fallback={<></>}>
      <Stack
        style={{
          padding: '8px',
          ...(bgColor !== undefined ? { background: `#${bgColor}` } : {}),
        }}
      >
        {isDark && <DarkTheme />}
        {mode === 'view' && (
          <Stack>
            {!readonly && (
              <Stack direction="row">
                <Button variant="contained" onClick={() => setMode('edit')}>
                  Edit
                </Button>
              </Stack>
            )}
            <SwaggerUI spec={swaggerRef.current} />
          </Stack>
        )}
        {mode === 'edit' && (
          <Editor setMode={setMode} swaggerRef={swaggerRef} />
        )}
      </Stack>
    </Suspense>
  );
};
