import { Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import { decompress } from './compression';

const Viewer = (): JSX.Element => {
  const swaggerRef = useRef<string | object | undefined>({});
  const [, render] = useState(false);
  const navigate = useNavigate();

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
      <Stack direction="row">
        <Button
          variant="contained"
          onClick={() =>
            navigate(
              `/editor${
                window.location.hash !== '#' ? window.location.hash : ''
              }`,
            )
          }
        >
          Edit
        </Button>
      </Stack>
      <SwaggerUI spec={swaggerRef.current} />
    </Stack>
  );
};

export default Viewer;
