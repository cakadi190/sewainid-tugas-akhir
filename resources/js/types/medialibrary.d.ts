export interface MediaLibrary {
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
  manipulations: Record<string | number, string>;
  custom_properties: Record<string | number, string>;
  generated_conversions: {
    preview: boolean;
  };
  responsive_images: Record<string | number, string>;
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
}
