export const compress = async (input: string): Promise<string> => {
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

export const decompress = async (input: string): Promise<string> => {
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
