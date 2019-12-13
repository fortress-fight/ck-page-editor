import C_Prompt from "@/components/c-prompt.vue";

export default function(option: any) {
    const PromptInstance = new C_Prompt({
        data: option
    });

    PromptInstance.$mount();
    document.body.appendChild(PromptInstance.$el);
    PromptInstance.$nextTick(() => {
        PromptInstance.show = true;
    });
    return PromptInstance;
}
