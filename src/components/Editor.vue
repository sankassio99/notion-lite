<template>
    <div class="w-3/4 py-6 px-8">
        <div class="controls h-3 p-1 flex items-end justify-end space-x-2">
            <button @click="onDelete">
                <span class="text-gray-500 hover:text-red-500">Excluir</span>
            </button>
            <button @click="onSave">
                <span class="text-gray-500 hover:text-blue-500">Salvar</span>
            </button>
        </div>

        <input 
            :value="note?.title"
            @input="onTitleChange"
            class="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
            placeholder="Título da nota" 
        />
        <div id="editorjs" class="ml-2 rounded p-4"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { Note } from '../editor.store';
import { editor, initEditor } from '../editor.store';

const props = defineProps<{
    note: Note | null;
}>();

const emit = defineEmits<{
    save: [],
    delete: [],
    'update:note': [note: Note]
}>();

const onSave = () => {
    emit('save');
};

const onDelete = () => {
    emit('delete');
};

const onTitleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (props.note) {
        emit('update:note', {
            ...props.note,
            title: target.value
        });
    }
};

// Initialize editor when component is mounted
onMounted(() => {
    initEditor(props.note?.content);
});

// Watch for note changes to update editor content
watch(() => props.note, (newNote) => {
    if (newNote?.content) {
        initEditor(newNote.content);
    } else {
        initEditor();
    }
}, { deep: true });
</script> 