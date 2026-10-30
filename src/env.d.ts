declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};

interface ImportMeta {
  env?: {
    [key: string]: string | undefined;
  };
}
