import Vue from 'vue'
import MaskedInput from 'vue-masked-input'

const app = new Vue({
        el: '#app',
        components: {
            MaskedInput
        },
        data() {
            return {
                currentUser: null,
                authMethod: "phone",
                gettingPhoneCode: false,
                countDown: 0,
                popupOpened: false,
                registerNewUser: false,
                currentPopup: {},
                popupsInfo: {
                    handmade: "Введите данные чека"
                },
                currentPopupTitle: false,
                checkRegistered: false,
                formData: {
                    phone: "",
                    phoneCode: "",
                    email: "",
                    password: "",
                    rePassword: "",
                    agreement: "",
                    name: "",
                },
                checkData: {
                    sum: "",
                    date: "",
                    time: "",
                    fn: "",
                    fd: "",
                    fdp: "",
                },
                errors: {
                    phoneCode: "",
                    phone: '',
                    email: "",
                    password: "",
                    rePassword: "",
                    agreement: "",
                    name: "",
                    sum: "",
                    date: "",
                    time: "",
                    fn: "",
                    fd: "",
                    fdp: "",
                },
                validation: {
                    phone: "",
                    phoneCode: "",
                    email: "",
                    password: "",
                    rePassword: "",
                    agreement: "",
                    name: "",
                    sum: "",
                    date: "",
                    time: "",
                    fn: "",
                    fd: "",
                    fdp: "",
                }
            }
        }, watch: {
            'checkData.date'(val) {
                this.maskedValidation(val, "date", "_")
            },
            'checkData.time'(val) {
                this.maskedValidation(val, "time", "_")
            },
            'formData.phone'(val) {
                this.maskedValidation(val, "phone", "_")
            },
            'checkData.sum'(val) {
                this.checkIsEmpty(val, "sum")
            },
            'checkData.fn'(val) {
                this.checkIsEmpty(val, "fn")
            },
            'checkData.fd'(val) {
                this.checkIsEmpty(val, "fd")
            },
            'checkData.fdp'(val) {
                this.checkIsEmpty(val, "fdp")
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
                if (![...val].some(isNaN)) {
                    //reuest to check pincode
                    const rightPin = "0000";
                    let alreadyExist = false;
                    if (val !== rightPin) {
                        this.formData.phoneCode = '';
                        this.errors.phoneCode = "Неправильно введен код";
                    } else {
                        if (alreadyExist) {
                            this.currentUser = true;
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
            initUploadCheck(method) {
                this.currentPopup.name = method;
                this.currentPopup.title = this.popupsInfo[method];
                this.popupOpened = true;
            },
            resetFields(...currentData) {
                currentData.forEach(name => {
                    for (const [field] of Object.entries(this[name])) {
                        this[name][field] = "";
                    }
                })
            },
            maskedValidation(val, field, symbol) {
                if (![...val].includes(symbol) && val.length > 0) {
                    this.validation[field] = true;
                } else if (this.validation[field]) {
                    this.validation[field] = false;
                }
            },
            checkIsEmpty(val, field) {
                if (val) {
                    this.validation[field] = true;
                } else {
                    this.validation[field] = false;
                }
            },
            uploadData() {
                let validData = true;
                if (!this.validateSum(this.checkData.sum)) {
                    validData = false;
                    this.errors.sum = "Введите сумму с копейками";
                }
                for (const [field, value] of Object.entries(this.checkData)) {
                    if (value === "") {
                        validData = false;
                        this.errors[field] = "Поле обязательно для заполнения"
                    }
                }
                if (validData) {
                    //    send data to register
                    console.log("data sent")
                    const data = this.checkData;
                    this.checkRegistered = true;
                    this.popupOpened = false;
                }

            },
            closePopup() {
                this.popupOpened = false;
                this.resetFields("formData", "checkData", "errors");
            },
            registration() {
                let validData = true;
                if(!this.validation.email) {
                    validData = false;
                    this.errors.email = "введите корректный E-mail"
                }
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
                    const data = this.formData;
                    //    send data to register
                    const response = {name: data.name}
                    this.currentUser = response;
                }
            },
            validateSum(value) {
                if (/[0-9]*\.[0-9]{2}/.test(value)) {
                    return (true)
                }
                return (false)
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
                if (this.validation.email) {
                    //    get data address of email end password

                    if (data.password !== "0000") {
                        this.formData.password = "";
                        this.errors.password = "Пароль указан некорректно";
                    } else {
                        console.log("send")
                    }
                } else {
                    this.errors.email = "введите корректный E-mail"
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
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs["popup"].classList.add("_init")
            })
        }
    })
;

