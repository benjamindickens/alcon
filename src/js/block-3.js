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
            registerNewUser: false,
            registeredUser: false,
            formData: {
                phone: "",
                phoneCode: "",
                email: "",
                password: "",
                rePassword: "",
                agreement: "",
                name: "",
            },
            errors: {
                phoneCode: "",
                phone: '',
                email: "",
                password: "",
                rePassword: "",
                agreement: "",
                name: "",
            },
            validation: {
                phone: "",
                phoneCode: "",
                email: "",
                password: "",
                rePassword: "",
                agreement: "",
                name: "",
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
            this.checkIsEmpty(val, "password")
        },
        'formData.rePassword'(val) {
            this.checkIsEmpty(val, "rePassword")
        },
        'formData.name'(val) {
            this.checkIsEmpty(val, "name")
        },
        'formData.agreement'(val) {
            this.checkIsEmpty(val, "agreement")
        },
        'formData.phoneCode'(val) {
            if (val.length > 4) {
                this.formData.phoneCode = val.splice(0, 3);
            }
            if (val.length === 4) {
                //reuest to check pincode
                const rightPin = "0000";
                let alreadyExist = false;
                if (val !== rightPin) {
                    this.formData.phoneCode = '';
                    this.errors.phoneCode = "Неправильно введен код";
                } else {
                    if (alreadyExist) {
                        this.registeredUser = true;
                    } else {
                        this.registerNewUser = true;
                    }

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
        checkIsEmpty(val, field) {
            if (val) {
                this.validation[field] = true;
            } else {
                this.validation[field] = false;
            }
        },
        registration() {
            let validData = true;
            if (this.formData.password != this.formData.rePassword) {
                validData = false;
                this.formData.password = ""
                this.formData.rePassword = ""
                this.errors.rePassword = "Пароли не совпадают";
                this.errors.password = "Пароли не совпадают";
            }
            for (const [field, value] of Object.entries(this.formData)) {
                if (value === "") {
                    validData = false;
                    this.errors[field] = "Поле обязательно для заполнения"
                }
            }

            if (validData) {
                //    send data to register
                console.log("registered")
                this.registeredUser = true;
            }
        },
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

