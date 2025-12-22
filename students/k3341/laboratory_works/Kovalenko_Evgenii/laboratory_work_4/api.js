// Конфигурация API
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/token/login/',
            LOGOUT: '/auth/token/logout/',
            REGISTER: '/auth/users/',
            CURRENT_USER: '/auth/users/me/'
        },
        GROUPS: '/groups/',
        STUDENTS: '/students/',
        TEACHERS: '/teachers/',
        SUBJECTS: '/subjects/',
        SCHEDULE: '/schedules/',
        GRADES: '/grades/',
        QUERIES: {
            SCHEDULE: '/queries/schedule/',
            TEACHERS_BY_GROUP: '/queries/teachers-by-group/',
            GROUPS_BY_SUBJECT_TEACHER: '/queries/groups-by-subject-teacher/',
            GROUP_SCHEDULE: '/queries/group-schedule/',
            STUDENTS_BY_COURSE: '/queries/students-by-course/',
            GROUP_PERFORMANCE: '/queries/group-performance/'
        },
        STATISTICS: {
            DASHBOARD: '/statistics/dashboard/',
            COURSES: '/statistics/courses/'
        }
    }
};

// Класс для работы с API
class CollegeAPI {
    constructor() {
        this.token = localStorage.getItem('token') || null;
        this.user = JSON.parse(localStorage.getItem('user') || 'null');

        // Настройка axios
        this.axios = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Добавляем интерцепторы
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Добавляем токен к запросам
        this.axios.interceptors.request.use(config => {
            if (this.token) {
                config.headers.Authorization = `Token ${this.token}`;
            }
            return config;
        });

        // Обрабатываем ошибки
        this.axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    this.clearAuth();
                    window.location.hash = '#/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Аутентификация
    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Методы API
    async login(username, password) {
        try {
            const response = await this.axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                username,
                password
            });

            const token = response.data.auth_token;
            this.setAuth(token, null);

            // Получаем данные пользователя
            const user = await this.getCurrentUser();
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Ошибка входа'
            };
        }
    }

    async register(userData) {
        try {
            const response = await this.axios.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Ошибка регистрации'
            };
        }
    }

    async logout() {
        try {
            await this.axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
            this.clearAuth();
            return { success: true };
        } catch (error) {
            this.clearAuth();
            return { success: true }; // Все равно выходим
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.axios.get(API_CONFIG.ENDPOINTS.AUTH.CURRENT_USER);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Группы
    async getGroups(params = {}) {
        return await this.axios.get(API_CONFIG.ENDPOINTS.GROUPS, { params });
    }

    async getGroup(id) {
        return await this.axios.get(`${API_CONFIG.ENDPOINTS.GROUPS}${id}/`);
    }

    async createGroup(data) {
        return await this.axios.post(API_CONFIG.ENDPOINTS.GROUPS, data);
    }

    async updateGroup(id, data) {
        return await this.axios.put(`${API_CONFIG.ENDPOINTS.GROUPS}${id}/`, data);
    }

    async deleteGroup(id) {
        return await this.axios.delete(`${API_CONFIG.ENDPOINTS.GROUPS}${id}/`);
    }

    // Студенты
    async getStudents(params = {}) {
        return await this.axios.get(API_CONFIG.ENDPOINTS.STUDENTS, { params });
    }

    async getStudent(id) {
        return await this.axios.get(`${API_CONFIG.ENDPOINTS.STUDENTS}${id}/`);
    }

    // Преподаватели
    async getTeachers(params = {}) {
        return await this.axios.get(API_CONFIG.ENDPOINTS.TEACHERS, { params });
    }

    // Запросы из задания
    async scheduleQuery(data) {
        return await this.axios.post(API_CONFIG.ENDPOINTS.QUERIES.SCHEDULE, data);
    }

    async teachersByGroup(data) {
        return await this.axios.post(API_CONFIG.ENDPOINTS.QUERIES.TEACHERS_BY_GROUP, data);
    }

    async groupsBySubjectTeacher(data) {
        return await this.axios.post(API_CONFIG.ENDPOINTS.QUERIES.GROUPS_BY_SUBJECT_TEACHER, data);
    }

    async groupSchedule(data) {
        return await this.axios.post(API_CONFIG.ENDPOINTS.QUERIES.GROUP_SCHEDULE, data);
    }

    async studentsByCourse(course) {
        return await this.axios.get(`${API_CONFIG.ENDPOINTS.QUERIES.STUDENTS_BY_COURSE}${course}/`);
    }

    async groupPerformanceReport(data) {
        return await this.axios.post(API_CONFIG.ENDPOINTS.QUERIES.GROUP_PERFORMANCE, data);
    }

    // Статистика
    async getDashboardStats() {
        return await this.axios.get(API_CONFIG.ENDPOINTS.STATISTICS.DASHBOARD);
    }
}

// Создаем глобальный экземпляр API
const api = new CollegeAPI();