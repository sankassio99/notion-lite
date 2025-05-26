<template>
    <div class="flex">
        <Sidebar />
        <div id="editor" class="w-3/4 py-6 px-8">
            <div class="controls h-3 p-1 flex items-end justify-end space-x-2">
                <button @click="deleteCurrentNote">
                    <span class="text-gray-500 hover:text-red-500">Excluir</span>
                </button>
                <button @click="saveNote">
                    <span class="text-gray-500 hover:text-blue-500">Salvar</span>
                </button>
            </div>

            <input :value="currentNote?.title"
                class="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                placeholder="Título da nota" />
            <div id="editorjs" class="ml-2 rounded p-4"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from './components/Sidebar.vue';
import { currentNote, editor, initEditor, Note, notes } from './editor.store';

const loadNotes = async (): Promise<void> => {
    notes.value = await (window as any).electronAPI.getNotes();
};

const saveNote = async (): Promise<void> => {
    const title = currentNote.value?.title?.trim();
    if (!title) return alert("Insira um título");

    const content = await editor.value?.save();

    const note = new Note(crypto.randomUUID(), title, content);

    await (window as any).electronAPI.saveNote(note);

    currentNote.value = note;

    loadNotes();
};

const deleteCurrentNote = async (): Promise<void> => {
    if (!currentNote.value) return alert("Selecione uma nota para excluir");
    await (window as any).electronAPI.deleteNote(currentNote.value?.uid);
    currentNote.value = null;
    initEditor();
    loadNotes();
};

onMounted(() => {
    loadNotes();
    initEditor();
});
</script>