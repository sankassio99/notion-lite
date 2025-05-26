import ImageTool from "@editorjs/image";
import EditorjsList from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import editorjsCodecup from "@calumk/editorjs-codecup";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { Ref, ref } from "vue";

const editor: Ref<EditorJS | null> = ref(null);

const currentNote: Ref<string | null> = ref(null);
const noteTitle: Ref<string | null> = ref(null);

const initEditor = (data?: OutputData): void => {
    if (editor.value) editor.value.destroy();

    editor.value = new EditorJS({
        holder: "editorjs",
        data,
        tools: {
            code: editorjsCodecup,
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
                        async uploadByFile(file: File) {
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

export { initEditor, editor, currentNote, noteTitle };