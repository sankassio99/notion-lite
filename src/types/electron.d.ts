import { Note } from '../editor.store';

interface ElectronAPI {
    getNotes: () => Promise<Note[]>;
    loadNote: (filename: string) => Promise<Note>;
    saveNote: (note: Note) => Promise<void>;
    deleteNote: (uid: string) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
} 