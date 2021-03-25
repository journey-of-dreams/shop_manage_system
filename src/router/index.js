import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = () => import('@/components/Login')
const Home = () => import('@/components/home/Home')
const Welcome = () => import('@/components/home/Welcome')
const Users = () => import('@/components/home/user/Users')
const Rights = () => import('@/components/home/power/Rights')
const Roles = () => import('@/components/home/power/Roles')
const Cate = () => import('@/components/home/goods/Cate')
const Params = () => import('@/components/home/goods/Params')

const routes = [{
        path: '',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                name: 'Welcome',
                component: Welcome
            },
            {
                path: '/users',
                name: 'Users',
                component: Users
            },
            {
                path: '/rights',
                name: 'Rights',
                component: Rights
            },
            {
                path: '/roles',
                name: 'Roles',
                component: Roles
            },
            {
                path: '/categories',
                name: 'Cate',
                component: Cate
            },
            {
                path: '/params',
                name: 'Params',
                component: Params
            },
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next()
    } else {
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) {
            return next('/login')
        }
        next()
    }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default router