import { Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTextContent, Mode } from 'vanilla-jsoneditor';

import { compress, decompress } from './compression';
import { hasError, JSONEditor } from './JSONEditor';

const Editor = (): JSX.Element => {
  const jsonEditedInputRef = useRef<unknown>({});
  const [isContentValid, setIsContentValid] = useState(true);
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
          jsonEditedInputRef.current = JSON.parse(decompressed);
          render(val => !val);
        })
        .catch(console.error);
    }
  }, [render]);

  return (
    <Stack gap={4}>
      <Stack direction="row">
        <Button
          variant="contained"
          disabled={!isContentValid}
          onClick={() =>
            void compress(JSON.stringify(jsonEditedInputRef.current)).then(
              compressed => {
                window.location.hash = compressed;
              },
            )
          }
        >
          Get link
        </Button>
      </Stack>
      <Stack direction="row">
        <Button
          variant="contained"
          onClick={() =>
            navigate(
              `/viewer${
                window.location.hash !== '#' ? window.location.hash : ''
              }`,
            )
          }
        >
          View
        </Button>
      </Stack>
      <JSONEditor
        mode={Mode.text}
        content={{ json: jsonEditedInputRef.current }}
        mainMenuBar={false}
        onChange={(nextContent, _prevContent, status) => {
          const nextIsContentValid = !hasError(status);
          setIsContentValid(nextIsContentValid);
          if (!nextIsContentValid) return;

          if (isTextContent(nextContent)) {
            const { text } = nextContent;
            jsonEditedInputRef.current = JSON.parse(text);
          }
        }}
        // TODO
        // validator={validator}
      />
    </Stack>
  );
};

export default Editor;
