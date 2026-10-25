import type { PageTheme } from './detect';
import type { EngineMode } from './engine';

/** Reply of the content script to `{ type: 'ptb:getStatus' }`. */
export interface PageStatus {
  host: string;
  theme: PageTheme | null;
  mode: EngineMode;
}
