interface ElectronAPI {
    getNotes: () => Promise<Array<{
        uid: string;
        title: string;
        content: any;
    }>>;
    saveNote: (note: {
        uid: string;
        title: string;
        content: any;
    }) => Promise<void>;
    deleteNote: (title: string) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
} 