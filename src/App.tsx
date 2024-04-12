import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useEffect, useRef, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import { decompress } from './compression';
import Editor from './Editor';

export const App = (): JSX.Element => {
  const swaggerRef = useRef<string | object | undefined>({});
  const [, render] = useState(false);
  const [mode, setMode] = useState('view');

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
    <Stack>
      {mode === 'view' && (
        <Stack>
          <Stack direction="row">
            <Button variant="contained" onClick={() => setMode('edit')}>
              Edit
            </Button>
          </Stack>
          <SwaggerUI spec={swaggerRef.current} />
        </Stack>
      )}
      {mode === 'edit' && <Editor setMode={setMode} swaggerRef={swaggerRef} />}
    </Stack>
  );
};
