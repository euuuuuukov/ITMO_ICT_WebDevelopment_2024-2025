// Компонент дашборда
const Dashboard = {
    template: `
        <div class="pa-6">
            <h1 class="text-h4 mb-6">Дашборд</h1>

            <!-- Статистика -->
            <v-row class="mb-6">
                <v-col cols="12" sm="6" md="3">
                    <v-card class="custom-card stat-card">
                        <v-card-title class="text-h6">Группы</v-card-title>
                        <v-card-text>
                            <div class="stat-number">{{ stats.groups || 0 }}</div>
                            <div class="stat-label">Всего групп</div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                    <v-card class="custom-card stat-card">
                        <v-card-title class="text-h6">Студенты</v-card-title>
                        <v-card-text>
                            <div class="stat-number">{{ stats.students || 0 }}</div>
                            <div class="stat-label">Активных студентов</div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                    <v-card class="custom-card stat-card">
                        <v-card-title class="text-h6">Преподаватели</v-card-title>
                        <v-card-text>
                            <div class="stat-number">{{ stats.teachers || 0 }}</div>
                            <div class="stat-label">Всего преподавателей</div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                    <v-card class="custom-card stat-card">
                        <v-card-title class="text-h6">Дисциплины</v-card-title>
                        <v-card-text>
                            <div class="stat-number">{{ stats.subjects || 0 }}</div>
                            <div class="stat-label">Всего дисциплин</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Быстрые действия -->
            <v-row class="mb-6">
                <v-col cols="12">
                    <v-card class="pa-4">
                        <v-card-title class="text-h6 mb-4">Быстрые действия</v-card-title>
                        <v-row>
                            <v-col cols="6" sm="3">
                                <v-btn
                                    color="primary"
                                    block
                                    to="/groups"
                                    prepend-icon="mdi-account-group"
                                >
                                    Группы
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="3">
                                <v-btn
                                    color="primary"
                                    block
                                    to="/students"
                                    prepend-icon="mdi-account-school"
                                >
                                    Студенты
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="3">
                                <v-btn
                                    color="primary"
                                    block
                                    to="/queries"
                                    prepend-icon="mdi-magnify"
                                >
                                    Запросы
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="3">
                                <v-btn
                                    color="primary"
                                    block
                                    to="/reports"
                                    prepend-icon="mdi-chart-bar"
                                >
                                    Отчёты
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Последние группы -->
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="text-h6">Последние группы</v-card-title>
                        <v-card-text>
                            <v-table v-if="recentGroups.length > 0">
                                <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Курс</th>
                                        <th>Студентов</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="group in recentGroups" :key="group.group_id">
                                        <td>{{ group.group_name }}</td>
                                        <td>{{ group.course }} курс</td>
                                        <td>{{ group.student_count }}</td>
                                        <td>
                                            <v-btn
                                                size="small"
                                                color="primary"
                                                variant="text"
                                                :to="'/groups/' + group.group_id"
                                            >
                                                Подробнее
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                            <div v-else class="text-center py-8">
                                <v-icon size="64" color="grey">mdi-account-group-off</v-icon>
                                <p class="text-h6 mt-4">Нет данных о группах</p>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    `,

    setup() {
        const stats = Vue.ref({
            groups: 0,
            students: 0,
            teachers: 0,
            subjects: 0
        });

        const recentGroups = Vue.ref([]);
        const loading = Vue.ref(true);

        const fetchData = async () => {
            try {
                loading.value = true;

                // Загружаем статистику
                const statsResponse = await api.getDashboardStats();
                stats.value = statsResponse.data;

                // Загружаем группы
                const groupsResponse = await api.getGroups();
                recentGroups.value = groupsResponse.data.slice(0, 5);

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                loading.value = false;
            }
        };

        // Загружаем данные при монтировании
        Vue.onMounted(fetchData);

        return {
            stats,
            recentGroups,
            loading
        };
    }
};

Vue.createApp({}).component('DashboardPage', Dashboard);