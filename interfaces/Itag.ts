type priority = "alta" | "media" | "baja";

export interface ITag {
  name: string;
  color: string;
  priority: priority;
  category: string;
} 