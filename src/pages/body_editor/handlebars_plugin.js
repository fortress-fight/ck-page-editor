import Handlebars from "handlebars/dist/handlebars";
Handlebars.registerHelper("if", function(conditional, options) {
    if (conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
Handlebars.registerHelper("has", function(conditional, options) {
    if (conditional) {
        return options.fn(this);
    } else {
        return "";
    }
});
Handlebars.registerHelper("filter", function() {
    let result;
    let arg = Array.from(arguments);
    let options = arg.pop();

    result = arg.filter(v => {
        return v;
    })[0];

    if (result) {
        return options.fn({ result });
    } else {
        return "";
    }
});

Handlebars.registerHelper("row", function(col_info, options) {
    let result = "";

    let rowArray = col_info !== "object" ? (col_info + "").split("_") : [];
    console.log(JSON.stringify(rowArray), "rowArray");
    for (var i = 0, l = rowArray.length; i < l; i++) {
        result += options.fn(rowArray[i]);
    }

    return result;
});
Handlebars.registerHelper("get", function(obj, key, options) {
    if (obj[key]) {
        return obj[key];
    } else {
        return true;
    }
    // let result = "";

    // let rowArray = col_info !== "object" ? (col_info + "").split("_") : [];
    // for (var i = 0, l = rowArray.length; i < l; i++) {
    //     result += options.fn(rowArray[i]);
    // }

    // return result;
});

Handlebars.registerHelper("with", function(context, options) {
    return options.fn(context);
});
export default Handlebars;
