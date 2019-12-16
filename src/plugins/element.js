import C_Background_Image_Upload from "@/components/c-background-image-upload.vue";
import C_Icon from "@/components/c-icon.vue";
import C_Input from "@/components/c-input.vue";
import Prompt from "@/components/c-prompt_handle";
import C_Radio from "@/components/c-radio.vue";
import C_Switch from "@/components/c-switch.vue";
import C_Tag_Input from "@/components/c-tag-input.vue";
import C_Upload from "@/components/c-upload.vue";
import {
    Alert,
    Autocomplete,
    Backtop,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    // Dialog,
    Icon,
    Input,
    InputNumber,
    Link,
    Loading,
    Main,
    Message,
    MessageBox,
    Radio,
    RadioButton,
    RadioGroup,
    Select,
    Switch,
    Tooltip,
    Transfer,
    Upload
} from "element-ui";
import Vue from "vue";

Vue.component("c-input", C_Input);
Vue.component("c-background-image-upload", C_Background_Image_Upload);
Vue.component("c-switch", C_Switch);
Vue.component("c-radio", C_Radio);
Vue.component("c-icon", C_Icon);
Vue.component("c-upload", C_Upload);
Vue.component("c-tag-input", C_Tag_Input);

// Vue.use(Pagination);
// Vue.use(Dialog);
Vue.use(Autocomplete);
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
// Vue.use(Menu);
// Vue.use(Submenu);
// Vue.use(MenuItem);
// Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
// Vue.use(Option);
// Vue.use(OptionGroup);
// Vue.use(Button);
// Vue.use(ButtonGroup);
// Vue.use(Table);
// Vue.use(TableColumn);
// Vue.use(DatePicker);
// Vue.use(TimeSelect);
// Vue.use(TimePicker);
// Vue.use(Popover);
Vue.use(Tooltip);
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Tabs);
// Vue.use(TabPane);
// Vue.use(Tag);
// Vue.use(Tree);
Vue.use(Alert);
// Vue.use(Slider);
Vue.use(Icon);
// Vue.use(Row);
// Vue.use(Col);
Vue.use(Upload);
// Vue.use(Progress);
// Vue.use(Spinner);
// Vue.use(Badge);
// Vue.use(Card);
// Vue.use(Rate);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
// Vue.use(Collapse);
// Vue.use(CollapseItem);
// Vue.use(Cascader);
// Vue.use(ColorPicker);
Vue.use(Transfer);
// Vue.use(Container);
// Vue.use(Header);
// Vue.use(Aside);
Vue.use(Main);
// Vue.use(Footer);
// Vue.use(Timeline);
// Vue.use(TimelineItem);
Vue.use(Link);
// Vue.use(Divider);
// Vue.use(Image);
// Vue.use(Calendar);
Vue.use(Backtop);
// Vue.use(PageHeader);
// Vue.use(CascaderPanel);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$c_prompt = Prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
