import { Button, Stack } from '@mui/material';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { isTextContent, Mode } from 'vanilla-jsoneditor';

import { compress } from './compression';
import { hasError, JSONEditor } from './JSONEditor';

const Editor = ({
  setMode,
  swaggerRef,
}: {
  setMode: Dispatch<SetStateAction<string>>;
  swaggerRef: MutableRefObject<string | object | undefined>;
}): JSX.Element => {
  const jsonEditedInputRef = useRef<unknown>(swaggerRef.current);
  const [isContentValid, setIsContentValid] = useState(true);

  return (
    <Stack gap={4}>
      <Stack direction="row">
        <Button
          variant="contained"
          disabled={!isContentValid}
          onClick={() =>
            void compress(JSON.stringify(jsonEditedInputRef.current)).then(
              compressed => {
                swaggerRef.current = jsonEditedInputRef.current as object;
                window.location.hash = compressed;
                setMode('view');
              },
            )
          }
        >
          Save
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
