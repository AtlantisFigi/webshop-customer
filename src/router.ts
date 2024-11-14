import { createRouter, createWebHistory} from "vue-router";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import ProductSearch from "./components/ProductSearch.vue";
import user from "./UserStorage.ts";

const routes = [
    {
        path: '/',
        component: ProductSearch,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            requireAuth: false
        },
    },
    {
        path: '/register',
        component: Register,
        meta: {
            requireAuth: false
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    if (to.path === "/login" && user.value) {
        next({
            path: '/',
            replace: true,
        });
        return
    }
    else if (to.meta.requireAuth && !user.value) {
        next({
            path: '/login',
            replace: true,
        })
    }
    else {
        next();
    }
})

export default router;