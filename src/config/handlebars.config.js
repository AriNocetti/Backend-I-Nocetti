import { create } from 'express-handlebars';

export const hbs = create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    //    extname: '.hbs',
    //    defaultLayout: 'main'
    helpers: {
        json: function (context) {
            return JSON.stringify(context, null, 2);
        },
        includes: function (str, substring) {
            if (!str) {
                return false;
            }
            if (Array.isArray(str)) {
                return str.some(item => item.includes(substring));
            }
            return str.includes(substring);
        },
        eq: function (a, b) {
            return a === b;
        }
    }
})


export default hbs;