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
            formData: {
                phone: "",
                phoneCode: "",
            },
            errors: {
                phoneCode: "",
                phone: '',
            },
            validation: {
                phone: "",
                phoneCode: "",
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
                }
                document.activeElement.blur();
            }

        }
    },
    computed: {
        convertedCountdown(){
           return this.countDown.toString().length < 2 ? `0${this.countDown}` : this.countDown
        }
    },
    methods: {
        sendCodeToPhone() {
            if (this.validation.phone) {
                if(!this.countDown){
                    this.gettingPhoneCode = true;
                    this.setCountDown(59)
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

