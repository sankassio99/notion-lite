<template>
    <SidebarProvider>
        <AppSidebar />
        <main class="w-full">
            <SidebarTrigger />
            <Editor></Editor>
        </main>
    </SidebarProvider>
</template>

<script setup>
import Editor from './components/Editor.vue';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import AppSidebar from "./components/AppSidebar.vue";

</script>