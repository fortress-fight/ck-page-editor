class Observable {
    constructor(obj) {
        this.dependence_target = null;
        this.dependence_target_array = new Set();
        this.obj = Object.create(obj);
        this.data = obj.data;
        return this.data;
    }

    dependence_manager() {
        const self = this;
        return {
            dependence_array: new Set(),
            depend(key) {
                if (self.dependence_target) {
                    this.dependence_array.add({
                        key,
                        target: self.dependence_target
                    });
                }
            },
            notify(key) {
                this.dependence_array.forEach(dependence => {
                    if (dependence.key == key) {
                        dependence.target(key);
                    }
                });
                self.dependence_target_array.clear();
            }
        };
    }

    computed_manager(obj) {
        const self = this;

        let result = obj;

        for (const [key, value] of Object.entries(self.obj.computed)) {
            let _result;

            result = new Proxy(result, {
                get(target, get_key, receiver) {
                    if (get_key === key) {
                        return _result;
                    } else {
                        return Reflect.get(target, get_key, receiver);
                    }
                },
                set(target, set_key, value, receiver) {
                    if (set_key === key) {
                        console.error("计算属性无法被赋值！");
                    } else {
                        Reflect.set(target, set_key, value, receiver);

                        return true;
                    }
                }
            });

            self.dependence_target = get_key => {
                if (!self.dependence_target_array.has(get_key)) {
                    self.dependence_target_array.add(get_key);
                    _result = value.call(obj);
                }
            };
            _result = value.call(obj);
        }

        return result;
    }

    set data(obj) {
        const _dependence_manager = this.dependence_manager(obj);
        let data_observable = new Proxy(obj, {
            get(target, key, receiver) {
                _dependence_manager.depend(key);
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                Reflect.set(target, key, value, receiver);
                _dependence_manager.notify(key);
                return true;
            }
        });

        this._data = this.computed_manager(data_observable);
    }

    get data() {
        return this._data;
    }
}

let people = new Observable({
    data: {
        name: "小明",
        friend: ["小白"]
    },
    computed: {
        test: function() {
            console.log(this.name + "hi");
            return this.friend.join("-");
        }
    }
});

people.name = "小白";
// people.name = "小亮";
people.friend.push(["小亮"]);
console.log(people.test);
