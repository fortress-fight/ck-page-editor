const { observable, observe } = require("dob");

const obj = observable({
    dom: [
        {
            title: "123"
        }
    ]
});

observe(function() {
    obj.dom.forEach(v => {
        console.log(v.title);
    });
}); // <· obj.a has changed to 1

// obj[0].a = 2; // <· obj.a has changed to 2
obj.dom.push({
    title: "add"
});

obj.dom[1].title = "asdf";
