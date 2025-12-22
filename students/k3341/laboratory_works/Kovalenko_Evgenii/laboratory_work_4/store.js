// Простое хранилище состояния с использованием реактивности Vue
const createStore = () => {
    const state = Vue.reactive({
        user: api.user,
        token: api.token,
        isAuthenticated: !!api.token,
        isLoading: false,
        error: null,

        // Кэшированные данные
        groups: [],
        students: [],
        teachers: [],
        subjects: [],

        // UI состояние
        drawer: true,
        theme: 'light'
    });

    // Геттеры
    const getters = {
        isAdmin: () => state.user?.is_staff || false,
        currentUser: () => state.user,
        fullName: () => {
            if (!state.user) return '';
            return `${state.user.first_name} ${state.user.last_name}`.trim();
        }
    };

    // Мутации
    const mutations = {
        SET_USER(user) {
            state.user = user;
            api.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },

        SET_TOKEN(token) {
            state.token = token;
            state.isAuthenticated = !!token;
            api.token = token;
            localStorage.setItem('token', token);
        },

        CLEAR_AUTH() {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            api.clearAuth();
        },

        SET_LOADING(loading) {
            state.isLoading = loading;
        },

        SET_ERROR(error) {
            state.error = error;
        },

        SET_GROUPS(groups) {
            state.groups = groups;
        },

        TOGGLE_DRAWER() {
            state.drawer = !state.drawer;
        },

        TOGGLE_THEME() {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        }
    };

    // Действия
    const actions = {
        async login({ commit }, credentials) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            const result = await api.login(credentials.username, credentials.password);

            if (result.success) {
                commit('SET_USER', result.user);
                return { success: true };
            } else {
                commit('SET_ERROR', result.error);
                return { success: false, error: result.error };
            }
        },

        async register({ commit }, userData) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            const result = await api.register(userData);

            if (result.success) {
                return { success: true };
            } else {
                commit('SET_ERROR', result.error);
                return { success: false, error: result.error };
            }
        },

        async logout({ commit }) {
            await api.logout();
            commit('CLEAR_AUTH');
        },

        async fetchGroups({ commit }) {
            try {
                const response = await api.getGroups();
                commit('SET_GROUPS', response.data);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', 'Ошибка загрузки групп');
                throw error;
            }
        },

        async fetchDashboardStats() {
            try {
                const response = await api.getDashboardStats();
                return response.data;
            } catch (error) {
                throw error;
            }
        }
    };

    return {
        state,
        getters,
        mutations,
        actions
    };
};

// Создаем и экспортируем хранилище
const store = createStore();