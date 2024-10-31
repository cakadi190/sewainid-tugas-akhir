import Database from "./database";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: Database['User'];
  };
  urlPath: {
    path?: string;
    name?: string;
    current?: string;
    url?: string;
  }
};
