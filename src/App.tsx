import { Button, Stack } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { LegacyRef, memo, useEffect, useRef, useState } from 'react';
import {
  ContentErrors,
  ContentParseError,
  ContentValidationErrors,
  isTextContent,
  JSONEditorPropsOptional,
  Mode,
  OnChangeStatus,
  JSONEditor as VanillaJSONEditor,
} from 'vanilla-jsoneditor';

const compress = async (input: string): Promise<string> => {
  const strBinInput = new TextEncoder().encode(input);

  const compressionStream = new CompressionStream('gzip');
  const compressionWriter = compressionStream.writable.getWriter();
  void compressionWriter.write(strBinInput);
  void compressionWriter.close();

  const compressedArrayBuffer = await new Response(
    compressionStream.readable,
  ).arrayBuffer();

  const output = Array.prototype.map
    .call(new Uint8Array(compressedArrayBuffer), (byte: number) =>
      ('00' + byte.toString(16)).slice(-2),
    )
    .join('');

  return output;
};

const decompress = async (input: string): Promise<string> => {
  const encodedBinOutput = new Uint8Array(
    [...(input.match(/.{1,2}/g) ?? [])].map(byte => parseInt(byte, 16)),
  ).buffer;

  const decompressionStream = new DecompressionStream('gzip');
  const decompressionWriter = decompressionStream.writable.getWriter();
  void decompressionWriter.write(encodedBinOutput);
  void decompressionWriter.close();

  const decompressedArrayBuffer = await new Response(
    decompressionStream.readable,
  ).arrayBuffer();

  const output = new TextDecoder().decode(decompressedArrayBuffer);

  return output;
};

export const arePropsEqual =
  <Props extends Record<string, unknown>>(...propKeys: (keyof Props)[]) =>
  (prevProps: Props, nextProps: Props): boolean =>
    propKeys.every(key => isEqual(prevProps[key], nextProps[key]));

const hasParseError = (
  contentErrors: ContentErrors | null,
): contentErrors is ContentParseError =>
  contentErrors !== null && 'parseError' in contentErrors;

const hasValidationErrors = (
  contentErrors: ContentErrors | null,
): contentErrors is ContentValidationErrors =>
  contentErrors !== null &&
  'validationErrors' in contentErrors &&
  contentErrors.validationErrors.length > 0;

export const hasError = ({ contentErrors }: OnChangeStatus): boolean =>
  hasParseError(contentErrors) || hasValidationErrors(contentErrors);

export const MemoizedJSONEditor = (
  props: JSONEditorPropsOptional,
): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<VanillaJSONEditor | null>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    editorRef.current = new VanillaJSONEditor({
      target: containerRef.current,
      props: {},
    });

    return () => {
      if (editorRef.current) {
        void editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      void editorRef.current.updateProps(props);
    }
  }, [props]);

  return <div ref={containerRef as LegacyRef<HTMLDivElement>} />;
};

const JSONEditor = memo(
  MemoizedJSONEditor,
  arePropsEqual('content', 'mode', 'mainMenuBar', 'navigationBar', 'readOnly'),
);

JSONEditor.displayName = 'JSONEditor';

export const App = (): JSX.Element => {
  const jsonEditedInputRef = useRef<unknown>({});
  const [isContentValid, setIsContentValid] = useState(true);
  const [, setState] = useState(false);

  useEffect(() => {
    let hash = window.location.hash;

    if (hash.startsWith('#')) {
      hash = hash.slice(1);
    }

    if (hash !== '') {
      decompress(hash)
        .then(decompressed => {
          jsonEditedInputRef.current = JSON.parse(decompressed);
          setState(val => !val);
        })
        .catch(console.error);
    }
  }, [setState]);

  return (
    <Stack gap={4}>
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
        Submit
      </Button>
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
