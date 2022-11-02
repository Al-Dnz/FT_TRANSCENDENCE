import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        name: "log",
        path: "/",
        components: {
            logpage: () => import("@/views/logscreen.vue"),
        },
    },
    {
        path: "/home",
        components: {
            default: () => import("@/views/Home.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "Home",
                type: String,
            },
        },
    },
    {
        path: "/user/:id",
        components: {
            default: () => import("@/views/Account.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "Account",
                type: String,
            },
        },
    },
    {
        path: "/chat",
        components: {
            default: () => import("@/views/Chat.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "Chat",
                type: String,
            },
        },
    },
    {
        path: "/chat/:id",
        components: {
            default: () => import("@/views/Chat.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "Chat",
                type: String,
            },
        },
    },
    {
        path: "/friendList",
        components: {
            default: () => import("@/views/Friendlist.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "Friendlist",
                type: String,
            },
        },
    },
    {
        path: "/spectate",
        components: {
            default: () => import("@/views/Spectate.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "Spectate",
                type: String,
            },
        },
    },
    {
        path: "/blocked",
        components: {
            default: () => import("@/views/BlockList.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "BlockedList",
                type: String,
            },
        },
    },
    {
        path: "/param",
        components: {
            default: () => import("@/views/Param.vue"),
            navbar: () => import("@/components/Nav.vue"),
            headbar: () => import("@/components/Header.vue"),
        },
        props: {
            headbar: {
                sectionTitle: "parametres",
                type: String,
            },
        },
    },
];
const baseURL = process.env.NODE_ENV === "production" ? "/app" : "/";
const router = createRouter({
    history: createWebHistory(baseURL),
    routes,
});

export default router;
