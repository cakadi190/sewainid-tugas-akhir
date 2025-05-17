import Database from "./database";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: Database['User'];
    isIdentityUnfilled?: boolean;
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

export type FetchSuccess<T = {}> = {
  success: boolean;
  message: string;
  data: T;
};

export type MediaLibraryType = {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: Array<Record<string, unknown>>;
  custom_properties: Array<Record<string, unknown>>;
  generated_conversions: {
    preview: boolean;
  };
  responsive_images: Array<Record<string, unknown>>;
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
}
