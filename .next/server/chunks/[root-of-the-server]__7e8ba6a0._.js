module.exports = {

"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/express [external] (express, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("express", () => require("express"));

module.exports = mod;
}}),
"[project]/src/pages/api/task.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$externals$5d2f$express__$5b$external$5d$__$28$express$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/express [external] (express, cjs)");
;
const port = 3000;
const app = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$express__$5b$external$5d$__$28$express$2c$__cjs$29$__["default"])();
app.use(__TURBOPACK__imported__module__$5b$externals$5d2f$express__$5b$external$5d$__$28$express$2c$__cjs$29$__["default"].json());
app.get('/api/data', (req, res)=>{
    res.json({
        message: {
            name: 'Wash Dishes',
            time: '1'
        }
    });
});
app.listen(3000, ()=>console.log(`Listening at port ${port}`));
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__7e8ba6a0._.js.map