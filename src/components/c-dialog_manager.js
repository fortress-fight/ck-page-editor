class Dialog_manager {
    constructor() {
        this.dialog_group = [];
    }
    add_dialog(dialog_components) {
        this.dialog_group.push(dialog_components);
    }
    remove_dialog(dialog_components_id) {
        this.dialog_group.splice(
            this.search_dialog(dialog_components_id).index,
            1
        );
    }
    search_dialog(id) {
        let result = {
            index: NaN,
            value: null
        };
        this.dialog_group.forEach((layout_component_obj, i) => {
            if (layout_component_obj.id === id) {
                result.index = i;
                result.value = layout_component_obj.layout_component;
            }
        });
        return result;
    }
    only_show(id) {
        this.dialog_group.forEach((layout_component_obj, i) => {
            if (!(layout_component_obj.id == id)) {
                layout_component_obj.layout_component.temporary_hide = true;
            }
        });
    }
    recovery_show() {
        this.dialog_group.forEach((layout_component_obj, i) => {
            layout_component_obj.layout_component.temporary_hide = false;
        });
    }
}

let manager = new Dialog_manager();

export default manager;
