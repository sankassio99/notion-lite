c<template>
    <div class="flex">
        <Sidebar />
        <Editor 
            v-model:note="currentNote"
            @save="saveNote"
            @delete="deleteCurrentNote"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from './components/Sidebar.vue';
import Editor from './components/Editor.vue';
import { currentNote, editor, initEditor, Note, notes } from './editor.store';

const loadNotes = async (): Promise<void> => {
    notes.value = await (window as any).electronAPI.getNotes();
};

const saveNote = async (): Promise<void> => {
    if (!currentNote.value) return alert("Nenhuma nota selecionada");

    const content = await editor.value?.save();
    
    if (currentNote.value.content !== content) {
        currentNote.value.content = content;
    }

    await (window as any).electronAPI.saveNote(currentNote.value);
    loadNotes();
};

const deleteCurrentNote = async (): Promise<void> => {
    if (!currentNote.value) return alert("Selecione uma nota para excluir");
    await (window as any).electronAPI.deleteNote(currentNote.value.uid);
    currentNote.value = null;
    initEditor();
    loadNotes();
};

onMounted(() => {
    loadNotes();
    initEditor();
});
</script>