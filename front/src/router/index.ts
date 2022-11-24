import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "log",
    path: "/",
    components: {
      log: () => import("@/views/logscreen.vue"),
    },
  },
  {
    name: "homePage",
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
    name: "accPage",
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
    name: 'chatHome',
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
    name: 'chat',
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
    path: "/chan/:id",
    name: 'chan',
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
    name: "friendPage",
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
    name: "spectatePage",
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
    name: "blockedPage",
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
    name: "paramPage",
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
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    components: {
      default: () => import("@/views/404.vue"),
      navbar: () => import("@/components/Nav.vue"),
      headbar: () => import("@/components/Header.vue"),
    },
    props: {
      headbar: {
        sectionTitle: "Cette page n'existe pas",
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
