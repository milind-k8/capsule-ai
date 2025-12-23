export interface GeneratedCodeState {
  code: string;
  loading: boolean;
  error: string | null;
}

export interface PromptInput {
  description: string;
  colors?: string;
  style?: string;
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isError?: boolean;
}