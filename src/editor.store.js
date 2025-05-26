import ImageTool from "@editorjs/image";
import EditorjsList from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import editorjsCodecup from "@calumk/editorjs-codecup";
import EditorJS from "@editorjs/editorjs";
import { ref } from "vue";

const editor = ref(null);

const initEditor = (data) => {
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

export { initEditor, editor }; 