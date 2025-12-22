// Главное приложение Vue
const App = {
    template: `
        <v-app :theme="store.state.theme">
            <!-- Боковая панель и панель навигации -->
            <v-navigation-drawer
                v-model="store.state.drawer"
                temporary
            >
                <v-list>
                    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
                                 :title="store.getters.fullName()"
                                 :subtitle="store.getters.isAdmin() ? 'Администратор' : 'Пользователь'">
                    </v-list-item>
                </v-list>

                <v-divider />

                <v-list>
                    <v-list-item
                        v-for="item in menuItems"
                        :key="item.title"
                        :prepend-icon="item.icon"
                        :title="item.title"
                        :value="item.title"
                        :to="item.to"
                        active-class="primary"
                    />
                </v-list>
            </v-navigation-drawer>

            <!-- Верхняя панель -->
            <v-app-bar color="primary">
                <v-app-bar-nav-icon @click="store.mutations.TOGGLE_DRAWER()" />

                <v-app-bar-title>Учебная часть колледжа</v-app-bar-title>

                <v-spacer />

                <v-btn icon @click="toggleTheme">
                    <v-icon>{{ store.state.theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
                </v-btn>

                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn icon v-bind="props">
                            <v-icon>mdi-account-circle</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item to="/profile">
                            <template v-slot:prepend>
                                <v-icon>mdi-account</v-icon>
                            </template>
                            <v-list-item-title>Профиль</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="logout">
                            <template v-slot:prepend>
                                <v-icon>mdi-logout</v-icon>
                            </template>
                            <v-list-item-title>Выйти</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>

            <!-- Основной контент -->
            <v-main>
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </v-main>

            <!-- Нижний колонтитул -->
            <v-footer app color="primary" class="text-center">
                <v-container>
                    <span class="text-white">Лабораторная работа 4. Клиентская часть на Vue.js & Vuetify</span>
                </v-container>
            </v-footer>

            <!-- Глобальный индикатор загрузки -->
            <v-overlay
                :model-value="store.state.isLoading"
                class="align-center justify-center"
            >
                <v-progress-circular
                    color="primary"
                    indeterminate
                    size="64"
                />
            </v-overlay>
        </v-app>
    `,

    setup() {
        const menuItems = [
            { title: 'Дашборд', icon: 'mdi-view-dashboard', to: '/' },
            { title: 'Группы', icon: 'mdi-account-group', to: '/groups' },
            { title: 'Студенты', icon: 'mdi-account-school', to: '/students' },
            { title: 'Преподаватели', icon: 'mdi-chalkboard-teacher', to: '/teachers' },
            { title: 'Запросы', icon: 'mdi-magnify', to: '/queries' },
            { title: 'Отчёты', icon: 'mdi-chart-bar', to: '/reports' }
        ];

        const toggleTheme = () => {
            store.mutations.TOGGLE_THEME();
        };

        const logout = async () => {
            await store.actions.logout();
            router.push('/login');
        };

        return {
            store,
            menuItems,
            toggleTheme,
            logout
        };
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const app = Vue.createApp(App);

    // Используем Vuetify
    app.use(Vuetify.createVuetify());

    // Используем маршрутизатор
    app.use(router);

    // Монтируем приложение
    app.mount('#app');
});