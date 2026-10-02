export interface APIProjectType {
  project_name: string;
  project_description: string | undefined;
  project_additional_info: {
    owner_name: string;
    owner_email_id: string;
  };
}

export type ProjectType = Record<string, string>;
