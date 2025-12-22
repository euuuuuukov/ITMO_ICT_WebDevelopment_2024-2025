// Создаем маршрутизатор
const createRouter = () => {
    const routes = [
        {
            path: '/',
            name: 'Dashboard',
            component: {
                template: `
                    <dashboard-page />
                `
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'Login',
            component: {
                template: `
                    <login-form />
                `
            },
            meta: { requiresAuth: false }
        },
        {
            path: '/register',
            name: 'Register',
            component: {
                template: `
                    <register-form />
                `
            },
            meta: { requiresAuth: false }
        },
        {
            path: '/groups',
            name: 'Groups',
            component: {
                template: `
                    <div class="pa-6">
                        <h1 class="text-h4 mb-4">Группы</h1>
                        <groups-page />
                    </div>
                `
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/students',
            name: 'Students',
            component: {
                template: `
                    <div class="pa-6">
                        <h1 class="text-h4 mb-4">Студенты</h1>
                        <students-page />
                    </div>
                `
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/teachers',
            name: 'Teachers',
            component: {
                template: `
                    <div class="pa-6">
                        <h1 class="text-h4 mb-4">Преподаватели</h1>
                        <teachers-page />
                    </div>
                `
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/queries',
            name: 'Queries',
            component: {
                template: `
                    <div class="pa-6">
                        <h1 class="text-h4 mb-4">Запросы к системе</h1>
                        <queries-page />
                    </div>
                `
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/reports',
            name: 'Reports',
            component: {
                template: `
                    <div class="pa-6">
                        <h1 class="text-h4 mb-4">Отчёты</h1>
                        <reports-page />
                    </div>
                `
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: {
                template: `
                    <div class="pa-6">
                        <h1 class="text-h4 mb-4">Профиль</h1>
                        <profile-page />
                    </div>
                `
            },
            meta: { requiresAuth: true }
        }
    ];

    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes
    });

    // Навигационные хуки
    router.beforeEach((to, from, next) => {
        const requiresAuth = to.meta.requiresAuth;
        const isAuthenticated = store.state.isAuthenticated;

        if (requiresAuth && !isAuthenticated) {
            next('/login');
        } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
            next('/');
        } else {
            next();
        }
    });

    return router;
};

// Создаем и экспортируем маршрутизатор
const router = createRouter();