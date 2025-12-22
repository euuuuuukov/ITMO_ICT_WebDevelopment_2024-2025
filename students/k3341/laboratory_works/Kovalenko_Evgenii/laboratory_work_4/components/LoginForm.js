// Компонент формы входа
const LoginForm = {
    template: `
        <v-container class="fill-height" fluid>
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card class="pa-6" elevation="4">
                        <v-card-title class="text-h5 text-center mb-4">
                            Вход в систему
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
                                v-model="form.password"
                                label="Пароль"
                                :rules="[v => !!v || 'Обязательное поле']"
                                type="password"
                                required
                                prepend-inner-icon="mdi-lock"
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

                            <v-btn
                                type="submit"
                                color="primary"
                                size="large"
                                block
                                :loading="loading"
                                class="mb-2"
                            >
                                Войти
                            </v-btn>

                            <v-divider class="my-4" />

                            <div class="text-center">
                                <span class="text-caption text-disabled">Нет аккаунта? </span>
                                <v-btn
                                    variant="text"
                                    color="primary"
                                    to="/register"
                                >
                                    Зарегистрироваться
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
            password: ''
        });

        const loading = Vue.ref(false);
        const error = Vue.ref('');
        const formRef = Vue.ref(null);

        const handleSubmit = async () => {
            const { valid } = await formRef.value.validate();

            if (!valid) return;

            loading.value = true;
            error.value = '';

            const result = await store.actions.login(form.value);

            if (result.success) {
                router.push('/');
            } else {
                error.value = result.error?.non_field_errors?.[0] ||
                             result.error?.detail ||
                             'Ошибка входа';
            }

            loading.value = false;
        };

        return {
            form,
            loading,
            error,
            formRef,
            handleSubmit
        };
    }
};

// Регистрируем компонент глобально
Vue.createApp({}).component('LoginForm', LoginForm);