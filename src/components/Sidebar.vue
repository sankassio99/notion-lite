<template>
    <div id="sidebar" class="w-[250px] bg-gray-100 p-4 border-r border-gray-300 h-screen">
        <button @click="createNewNote" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            + Nova Nota
        </button>
        <ul class="mt-4 space-y-2">
            <li v-for="note in notes" :key="note.uid" @click="loadNote(note.uid)"
                class="cursor-pointer hover:bg-gray-200 p-2 rounded line-clamp-2">
                {{ note.title }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { currentNote, initEditor, Note, notes } from '@/editor.store';
import { onMounted } from 'vue';

onMounted(async () => {
    const data = await (window as any).electronAPI.getNotes();
    notes.value = data.map((note: any) => new Note(note.uid, note.title, note.content));
});

const loadNote = async (uid: string) => {
    const data = await (window as any).electronAPI.loadNote(uid);
    currentNote.value = new Note(uid, data.title, data.content);
    initEditor();
};

const createNewNote = () => {
    currentNote.value = new Note(crypto.randomUUID(), "Nova Nota", {});
    initEditor();
};
</script>