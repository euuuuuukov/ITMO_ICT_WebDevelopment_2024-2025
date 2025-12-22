// Компонент формы регистрации
const RegisterForm = {
    template: `
        <v-container class="fill-height" fluid>
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card class="pa-6" elevation="4">
                        <v-card-title class="text-h5 text-center mb-4">
                            Регистрация
                        </v-card-title>

                        <v-form @submit.prevent="handleSubmit" ref="form">
                            <v-text-field
                                v-model="form.username"
                                label="Имя пользователя"
                                :rules="[v => !!v || 'Обязательное поле']"
                                required
                                prepend-inner-icon="mdi-account"
                                variant="outlined"
                                class="mb-4"
                            />

                            <v-text-field
                                v-model="form.email"
                                label="Email"
                                :rules="[
                                    v => !!v || 'Обязательное поле',
                                    v => /.+@.+\..+/.test(v) || 'Некорректный email'
                                ]"
                                type="email"
                                required
                                prepend-inner-icon="mdi-email"
                                variant="outlined"
                                class="mb-4"
                            />

                            <v-text-field
                                v-model="form.first_name"
                                label="Имя"
                                :rules="[v => !!v || 'Обязательное поле']"
                                required
                                prepend-inner-icon="mdi-account-outline"
                                variant="outlined"
                                class="mb-4"
                            />

                            <v-text-field
                                v-model="form.last_name"
                                label="Фамилия"
                                :rules="[v => !!v || 'Обязательное поле']"
                                required
                                prepend-inner-icon="mdi-account-outline"
                                variant="outlined"
                                class="mb-4"
                            />

                            <v-text-field
                                v-model="form.password"
                                label="Пароль"
                                :rules="[
                                    v => !!v || 'Обязательное поле',
                                    v => (v && v.length >= 8) || 'Минимум 8 символов'
                                ]"
                                type="password"
                                required
                                prepend-inner-icon="mdi-lock"
                                variant="outlined"
                                class="mb-4"
                            />

                            <v-text-field
                                v-model="form.password_confirm"
                                label="Подтверждение пароля"
                                :rules="[
                                    v => !!v || 'Обязательное поле',
                                    v => v === form.password || 'Пароли не совпадают'
                                ]"
                                type="password"
                                required
                                prepend-inner-icon="mdi-lock-check"
                                variant="outlined"
                                class="mb-4"
                            />

                            <v-alert
                                v-if="error"
                                type="error"
                                class="mb-4"
                            >
                                {{ error }}
                            </v-alert>

                            <v-alert
                                v-if="success"
                                type="success"
                                class="mb-4"
                            >
                                Регистрация успешна! Перенаправляем на страницу входа...
                            </v-alert>

                            <v-btn
                                type="submit"
                                color="primary"
                                size="large"
                                block
                                :loading="loading"
                                class="mb-2"
                            >
                                Зарегистрироваться
                            </v-btn>

                            <v-divider class="my-4" />

                            <div class="text-center">
                                <span class="text-caption text-disabled">Уже есть аккаунт? </span>
                                <v-btn
                                    variant="text"
                                    color="primary"
                                    to="/login"
                                >
                                    Войти
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    `,

    setup() {
        const form = Vue.ref({
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            password_confirm: ''
        });

        const loading = Vue.ref(false);
        const error = Vue.ref('');
        const success = Vue.ref(false);
        const formRef = Vue.ref(null);

        const handleSubmit = async () => {
            const { valid } = await formRef.value.validate();

            if (!valid) return;

            loading.value = true;
            error.value = '';
            success.value = false;

            const result = await store.actions.register(form.value);

            if (result.success) {
                success.value = true;
                // Перенаправляем на страницу входа через 2 секунды
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                error.value = formatErrors(result.error);
            }

            loading.value = false;
        };

        const formatErrors = (error) => {
            if (!error) return 'Ошибка регистрации';

            if (typeof error === 'string') return error;

            const messages = [];
            for (const key in error) {
                if (Array.isArray(error[key])) {
                    messages.push(...error[key].map(msg => `${key}: ${msg}`));
                } else {
                    messages.push(`${key}: ${error[key]}`);
                }
            }

            return messages.join(', ');
        };

        return {
            form,
            loading,
            error,
            success,
            formRef,
            handleSubmit
        };
    }
};

Vue.createApp({}).component('RegisterForm', RegisterForm);