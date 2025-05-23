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
        },
        formatDate: function (date) {
            return new Date(date).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
})


export default hbs;