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
import { onMounted, ref } from 'vue';

const notes = ref([]);

const createNewNote = () => {
    notes.value.push('Nova Nota');
};

onMounted(() => {
    loadNote();
});

const loadNote = async (note) => {
    notes.value = await window.electronAPI.getNotes();
};
</script>