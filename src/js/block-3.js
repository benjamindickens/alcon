import Vue from 'vue'
import MaskedInput from 'vue-masked-input'
import {QrcodeStream, QrcodeCapture} from 'vue-qrcode-reader'

const app = new Vue({
        el: '#app',
        components: {
            MaskedInput, QrcodeCapture, QrcodeStream
        },
        data() {
            return {
                uploadedQr: "",
                currentUser: true,
                authMethod: "phone",
                gettingPhoneCode: false,
                countDown: 0,
                popupOpened: false,
                registerNewUser: false,
                currentPopup: {},
                successOperation: false,
                popupsInfo: {
                    handmade: "Введите данные чека",
                    error: "Обратите внимание!",
                    manualCheck: "Чек загружен",
                    scan: "Пожалуйста, наведите камеру на QR-код",
                },
                error: null,
                currentPopupTitle: false,
                phoneCode: "",
                formData: {
                    phone: "",
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
                const isValid = this.validateSum(this.checkData.sum);
                if (isValid) {
                    this.validation.sum = true;
                } else {
                    this.validation.sum = false;
                }
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
            async phoneCode(val) {
                if (![...val].some(isNaN)) {
                    //проверяем на серве верный ли пинкод
                    // try {
                    //     const res = await this.submitForm("http://localhost/checkcode", {
                    //         phoneCode: val,
                    //         phone: this.formData.phone
                    //     });
                    //
                    //     if (res.data.user) {
                    //         this.currentUser = res.data.user;
                    //     } else {
                    //         // если нет начинаеться регистрация
                    //         this.registerNewUser = true;
                    //     }
                    // } catch(e){
                    //     console.error(e)
                    //     this.phoneCode = '';
                    //     this.errors.phoneCode = "Неправильно введен код";
                    // }


                    //удалить потом феиковый рес ниже все логика в трай кач переидет
                    const res = {
                        data: {
                            success: true,
                        }
                    }
                    //если код не совпад с требуемым сбрасываеться и ошибка
                    if (!res.data.success) {
                        this.phoneCode = '';
                        this.errors.phoneCode = "Неправильно введен код";
                    } else {
                        //если юзер есть в базе он сразу авторизиуется,
                        if (res.data.user) {
                            this.currentUser = res.data.user;
                        } else {
                            // если нет начинаеться регистрация
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
            paintBoundingBox(detectedCodes, ctx) {
                for (const detectedCode of detectedCodes) {
                    const {boundingBox: {x, y, width, height}} = detectedCode

                    ctx.lineWidth = 2
                    ctx.strokeStyle = '#007bff'
                    ctx.strokeRect(x, y, width, height)
                }
            },
            onScan(result) {
                this.uploadedQr = result;
                try {
                    //отправка кьюар кода
                    // const res = await this.submitForm("http://localhost/sendQr", this.uploadedQr);
                    this.currentPopup = {};
                    this.popupOpened = false;
                    this.successOperation = true;
                } catch (e) {
                    console.error(e)
                }

            },
            async onInit(promise) {
                try {
                    await promise
                } catch (error) {
                    if (error.name === 'NotAllowedError') {
                        this.error = "ERROR: you need to grant camera access permission"
                    } else if (error.name === 'NotFoundError') {
                        this.error = "ERROR: no camera on this device"
                    } else if (error.name === 'NotSupportedError') {
                        this.error = "ERROR: secure context required (HTTPS, localhost)"
                    } else if (error.name === 'NotReadableError') {
                        this.error = "ERROR: is the camera already in use?"
                    } else if (error.name === 'OverconstrainedError') {
                        this.error = "ERROR: installed cameras are not suitable"
                    } else if (error.name === 'StreamApiNotSupportedError') {
                        this.error = "ERROR: Stream API is not supported in this browser"
                    } else if (error.name === 'InsecureContextError') {
                        this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
                    } else {
                        this.error = `ERROR: Camera error (${error.name})`;
                    }
                }
            },
            async sendToCheck() {

                const img = this.$refs.checkUpload.$el.files[0];
                try {
                    //отправка фотки чека на ручную проверку
                    // const res = await this.submitForm("http://localhost/sendImg", img);
                    this.initUploadCheck("manualCheck")
                } catch (e) {
                    console.error(e)
                }
            },
            async onDetect(promise) {
                try {
                    const {content} = await promise;
                    this.uploadedQr = content;
                    if (!this.uploadedQr) {
                        this.initUploadCheck("error")
                    } else {
                        try {
                            //отправка кьюар кода
                            // const res = await this.submitForm("http://localhost/sendQr", this.uploadedQr);
                            this.successOperation = true;
                        } catch (e) {
                            console.error(e)
                        }

                    }
                } catch (e) {
                    console.error(e)
                }
            },
            initUploadCheck(method) {
                this.currentPopup.name = method;
                this.currentPopup.title = this.popupsInfo[method];
                this.popupOpened = false;
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
            async uploadData() {
                let validData = true;
                if (!this.validation.sum) {
                    validData = false;
                    this.errors.sum = "Введите сумму с копейками";
                }

                if (!this.validation.date) {
                    validData = false;
                    this.errors.date = "Введите дату в формате ДД. ММ. ГГГГ";
                }

                if (!this.validation.time) {
                    validData = false;
                    this.errors.time = "Введите время в формате ЧЧ:ММ";
                }

                for (const [field, value] of Object.entries(this.checkData)) {
                    if (value === "") {
                        validData = false;
                        this.errors[field] = "Поле обязательно для заполнения"
                    }
                }

                this.checkData.sum = parseFloat(this.checkData.sum).toFixed(2);

                if (validData) {
                    try {
                        //загрузка данных чека
                        // const res = await this.submitForm("http://localhost/uploadCheck", this.checkData);
                        this.popupOpened = false;
                        this.successOperation = true;
                        this.resetFields("checkData")

                    } catch (e) {
                        //обработка ошибок
                        console.error(e)
                    }
                }

            },
            closePopup() {
                this.popupOpened = false;
                this.resetFields("formData", "checkData", "errors");
            },
            async registration() {

                let validData = true;
                if (!this.validation.email) {
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
                    if (!value) {
                        validData = false;
                        this.errors[field] = "Поле обязательно для заполнения"
                    }
                }

                if (validData) {
                    try {
                        //регистрация юзера
                        // const res = await this.submitForm("http://localhost/userRegistration", this.formData);
                        //запись созданого юзера как текущего
                        // this.currentUser = res.data.user;
                    } catch (e) {
                        console.error(e)
                    }

                    //    феик дата
                    this.currentUser = {name: this.formData.name}
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
                this.resetFields("formData")
                this.authMethod = this.authMethod === "phone" ? "email" : "phone";
            },
            async authWithEmail() {
                const data = {
                    email: this.formData.email,
                    password: this.formData.password
                }
                if (this.validation.email) {
                    //авторицацияю юзера через меил
                    try {
                        const res = await this.submitForm("http://localhost/login", data);
                        this.currentUser = res.data.user;
                    } catch (e) {
                        this.formData.password = "";
                        this.errors.password = "Пароль указан некорректно";
                    }

                } else {
                    this.errors.email = "введите корректный E-mail"
                }
            },
            async submitForm(url, data) {
                const res = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(data),
                });
                return res;
            },
            async sendCodeToPhone() {
                if (this.validation.phone) {
                    if (!this.countDown) {
                        //запрос на получение смс кода
                        // await this.submitForm("http://localhost/getcode", {phone: this.formData.phone});
                        this.gettingPhoneCode = true;
                        this.setCountDown(59)
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
        },
        created() {
            //    request to get data if you loged in
            //     this.currentUser = res;
        }
    })
;

