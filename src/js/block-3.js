import Vue from 'vue'
import MaskedInput from 'vue-masked-input'

const app = new Vue({
    el: '#app',
    components: {
        MaskedInput
    },
    data() {
        return {
            stage: 2,
            authMethod: "phone",
            gettingPhoneCode: false,
            countDown: 0,
            authNewUser: false,
            formData: {
                phone: "",
                phoneCode: "",
                email: "",
                password: "",
                rePassword: "",
                agreement: "",
            },
            errors: {
                phoneCode: "",
                phone: '',
                email: "",
                password: "",
                rePassword: "",
                agreement: "",
            },
            validation: {
                phone: "",
                phoneCode: "",
                email: "",
                password: "",
                rePassword: "",
                agreement: "",
            }
        }
    }, watch: {
        'formData.phone'(val) {
            if ([...val].pop() !== "_") {
                this.validation.phone = true;
            } else if (this.validation.phone) {
                this.validation.phone = false;
            }
        },
        'formData.email'(val) {
            const isValid = this.validateEmail(val);
            if (isValid) {
                this.validation.email = true;
            } else {
                this.validation.email = false;
            }
        },
        'formData.password'(val) {
            if (val) {
                this.validation.password = true;
            } else {
                this.validation.password = false;
            }
        },
        'formData.phoneCode'(val) {
            if (val.length > 4) {
                this.formData.phoneCode = val.splice(0, 3);
            }
            if (val.length === 4) {
                const rightPin = "0000";
                if (val !== rightPin) {
                    this.formData.phoneCode = '';
                    this.errors.phoneCode = "Неправильно введен код";
                } else {
                    this.authNewUser = true;
                }
                document.activeElement.blur();
            }

        }
    },
    computed: {
        convertedCountdown() {
            return this.countDown.toString().length < 2 ? `0${this.countDown}` : this.countDown
        }
    },
    methods: {
        validateEmail(mail) {
            if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail)) {
                return (true)
            }
            return (false)
        },
        switchAuthMethod() {
            this.authMethod = this.authMethod === "phone" ? "email" : "phone";
        },
        authWithEmail() {
            const data = {
                email: this.formData.email,
                password: this.formData.password
            }
            //    get data address of email end password
            if (data.password != 0) {
                this.formData.password = "";
                this.errors.password = "Пароль указан некорректно";
            } else {
                console.log("send")
            }
        },
        sendCodeToPhone() {
            if (this.validation.phone) {
                if (!this.countDown) {
                    this.gettingPhoneCode = true;
                    this.setCountDown(59)
                    const data = this.formData.phone
                    //    fetch request to send sms
                }
            } else {
                this.errors.phone = "Неправильно введен номер";
            }
        },
        setCountDown(value = 59) {
            this.countDown = value;
            this.countDownTimer();
        },
        countDownTimer() {
            if (this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            }
        }
    }
});

