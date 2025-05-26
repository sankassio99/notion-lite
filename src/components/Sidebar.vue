<template>
    <div id="sidebar" class="w-[250px] bg-gray-100 p-4 border-r border-gray-300 h-screen">
        <button @click="createNewNote" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            + Nova Nota
        </button>
        <ul class="mt-4 space-y-2">
            <li v-for="note in notes" :key="note" @click="loadNote(note)"
                class="cursor-pointer hover:bg-gray-200 p-2 rounded line-clamp-2">
                {{ note }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { currentNote, initEditor, noteTitle } from '@/editor.store';
import { onMounted, ref } from 'vue';

const notes = ref([]);

onMounted(async () => {
    notes.value = await window.electronAPI.getNotes();
});

const loadNote = async (name) => {
    currentNote.value = name;
    const data = await window.electronAPI.loadNote(name);
    noteTitle.value = name;
    initEditor(data);
};

const createNewNote = () => {
    currentNote.value = null;
    noteTitle.value = "Nova Nota";
    initEditor();
};
</script>