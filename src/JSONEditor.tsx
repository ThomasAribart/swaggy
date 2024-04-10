import isEqual from 'lodash/isEqual';
import { LegacyRef, memo, useEffect, useRef } from 'react';
import {
  ContentErrors,
  ContentParseError,
  ContentValidationErrors,
  JSONEditorPropsOptional,
  OnChangeStatus,
  JSONEditor as VanillaJSONEditor,
} from 'vanilla-jsoneditor';

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

export const JSONEditor = memo(
  MemoizedJSONEditor,
  arePropsEqual('content', 'mode', 'mainMenuBar', 'navigationBar', 'readOnly'),
);

JSONEditor.displayName = 'JSONEditor';
