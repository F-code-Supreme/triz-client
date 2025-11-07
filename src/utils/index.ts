export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export * from './string/string';
export * from './url/url';
