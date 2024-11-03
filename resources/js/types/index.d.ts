import Database from "./database";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: Database['User'];
  };
  alert?: {
    success?: string;
    error?: string;
    info?: string;
    danger?: string;
    warning?: string;
  },
  urlPath: {
    path?: string;
    name?: string;
    current?: string;
    url?: string;
  }
};
