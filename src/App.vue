<template>
    <!-- <div class="flex">
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
        <div id="editor" class="w-3/4 py-6 px-8">
            <div class="controls h-3 p-1 flex items-end justify-end space-x-2">
                <button @click="deleteCurrentNote">
                    <span class="text-gray-500 hover:text-red-500">Excluir</span>
                </button>
                <button @click="saveNote">
                    <span class="text-gray-500 hover:text-blue-500">Salvar</span>
                </button>
            </div>

            <input v-model="noteTitle"
                class="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                placeholder="Título da nota" />
            <div id="editorjs" class="ml-2 rounded p-4"></div>
        </div>
    </div> -->
    <SidebarProvider>
        <AppSidebar />
        <main>
            <SidebarTrigger />
            <slot></slot>
        </main>
    </SidebarProvider>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EditorJS from "@editorjs/editorjs";
import Checklist from "@editorjs/checklist";
import ImageTool from "@editorjs/image";
import EditorjsList from '@editorjs/list';
import editorjsCodecup from '@calumk/editorjs-codecup';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'
import AppSidebar from "../components/AppSidebar.vue";

const editor = ref(null);
const currentNote = ref(null);
const notes = ref([]);
const noteTitle = ref("");

const initEditor = (data = null) => {
    if (editor.value) editor.value.destroy();

    editor.value = new EditorJS({
        holder: "editorjs",
        data: data,
        tools: {
            code : editorjsCodecup,
            list: {
                class: EditorjsList,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered'
                },
            },
            checklist: {
                class: Checklist,
                inlineToolbar: true,
            },
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        async uploadByFile(file) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            return new Promise((resolve) => {
                                reader.onload = () => {
                                    resolve({
                                        success: 1,
                                        file: { url: reader.result },
                                    });
                                };
                            });
                        },
                    },
                },
            },
        },
    });
};

const loadNotes = async () => {
    notes.value = await window.electronAPI.getNotes();
};

const createNewNote = () => {
    noteTitle.value = "";
    currentNote.value = null;
    initEditor();
};

const loadNote = async (name) => {
    currentNote.value = name;
    const data = await window.electronAPI.loadNote(name);
    noteTitle.value = name;
    initEditor(data);
};

const saveNote = async () => {
    const title = noteTitle.value.trim();
    if (!title) return alert("Insira um título");

    const content = await editor.value.save();
    const uid = crypto.randomUUID();
    await window.electronAPI.saveNote({ uid, title, content });
    currentNote.value = title;
    loadNotes();
};

const deleteCurrentNote = async () => {
    if (!currentNote.value) return alert("Selecione uma nota para excluir");
    await window.electronAPI.deleteNote(currentNote.value);
    currentNote.value = null;
    noteTitle.value = "";
    initEditor();
    loadNotes();
};

onMounted(() => {
    loadNotes();
    initEditor();
});
</script>