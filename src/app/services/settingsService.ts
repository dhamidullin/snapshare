const STORAGE_KEYS = {
  AUTO_COPY: 'autoCopy',
  SHOW_PREVIEW: 'showPreview',
  PASSWORD: 'password',
  UPLOADED_LINKS: 'uploadedLinks',
} as const;

const MAX_STORED_LINKS = 50; // Limit the number of stored links to prevent localStorage overflow

export interface Settings {
  autoCopy: boolean;
  showPreview: boolean;
}

export const settingsService = {
  getAutoCopy(): boolean {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(STORAGE_KEYS.AUTO_COPY);
    return saved !== null ? saved === 'true' : false;
  },

  setAutoCopy(value: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTO_COPY, value.toString());
  },

  getShowPreview(): boolean {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_PREVIEW);
    return saved !== null ? saved === 'true' : true;
  },

  setShowPreview(value: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SHOW_PREVIEW, value.toString());
  },

  getPassword(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.PASSWORD);
  },

  setPassword(value: string | null): void {
    if (typeof window === 'undefined') return;
    if (value === null) {
      localStorage.removeItem(STORAGE_KEYS.PASSWORD);
    } else {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, value);
    }
  },

  clearPassword(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PASSWORD);
  },

  getUploadedLinks(): string[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEYS.UPLOADED_LINKS);
    return saved ? JSON.parse(saved) : [];
  },

  addUploadedLink(link: string): void {
    if (typeof window === 'undefined') return;
    const links = this.getUploadedLinks();
    
    // Add new link to the beginning of the array
    const updatedLinks = [link, ...links];
    
    // Keep only the last MAX_STORED_LINKS items
    const trimmedLinks = updatedLinks.slice(0, MAX_STORED_LINKS);
    
    localStorage.setItem(STORAGE_KEYS.UPLOADED_LINKS, JSON.stringify(trimmedLinks));
  },

  removeUploadedLink(link: string): void {
    if (typeof window === 'undefined') return;
    const links = this.getUploadedLinks();
    const updatedLinks = links.filter(l => l !== link);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_LINKS, JSON.stringify(updatedLinks));
  },

  clearUploadedLinks(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_LINKS);
  }
}; 