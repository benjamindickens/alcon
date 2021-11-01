const weeksBtn = document.querySelectorAll("[data-week]");
const infoContainer = document.querySelector('[data-week-info="container"]');
const infoWeek= document.querySelector('[data-week-info="week"]');
const infoDates = document.querySelector('[data-week-info="dates"]');
const infoDraw = document.querySelector('[data-week-info="draw"]');
const infoSubscription = document.querySelector('[data-week-info="subscription"]');
const infoWatches = document.querySelector('[data-week-info="watches"]');
let activeWeek = null;
const eventTime = {};
const giftsInfo = {
    'week-1': {
        dates: "22.11.21 — 28.11.21",
        draw: "3 декабря 2021",
        subscription: 10,
        watches: 1,
    },
    'week-2': {
        dates: "29.11.21 — 5.12.21",
        draw: "10 декабря 2021",
        subscription: 15,
        watches: 3,
    },
    'week-3': {
        dates: "6.12.21 — 12.12.21",
        draw: "17 декабря 2021",
        subscription: 20,
        watches: 5,
    },
    'week-4': {
        dates: "13.12.21 — 19.12.21",
        draw: "24 декабря 2021",
        subscription: 25,
        watches: 7,
    },
    'week-5': {
        dates: "20.12.21 — 24.12.21",
        draw: "29 декабря 2021",
        subscription: 40,
        watches: 12,
    }
}
const setActiveBtn = (btn) => {
    if (document.querySelector("._active[data-week]")) {
        document.querySelector("._active[data-week]").classList.remove("_active")
    }
    btn.classList.add("_active");
    activeWeek = btn.dataset.week;
    setCurrentGifts(activeWeek);
}

const setCurrentGifts = (currentWeek) => {
    const info = giftsInfo[`week-${currentWeek}`];
    infoWeek.innerHTML = `Неделя ${currentWeek}`;
    infoDates.innerHTML = info.dates;
    infoDraw.innerHTML = info.draw;
    infoSubscription.innerHTML = info.subscription;
    infoWatches.innerHTML = info.watches;
}


const calculateCurrentWeek = () => {

    const currentDateHours = Date.now() / 1000 * 60 * 60 * 24;

    weeksBtn.forEach((btn, index) => {
        const weekData = btn.innerHTML.split(" ");
        weekData.splice(1, 1);
        const result = weekData.map(value => {
            const convertedValue = value.split(".").reverse().join("/");
            const date = new Date(`${convertedValue}/2021`);
            return date.getTime() / 1000 * 60 * 60 * 24;
        })

        if (index === 0) {
            eventTime.start = {time: result[0], btn};
        } else if (index === weeksBtn.length - 1) {
            eventTime.end = {time: result[1], btn};
        }

        if (currentDateHours >= result[0] && currentDateHours <= result[1]) {
            setActiveBtn(btn)
        }

        btn.addEventListener("click", () => {
            if (activeWeek != btn.dataset.week) {
                setActiveBtn(btn)
            }
        })
    })

    if (!activeWeek) {
        if (currentDateHours < eventTime.start.time) {
            setActiveBtn(eventTime.start.btn)
        } else if (currentDateHours < eventTime.end.time) {
            setActiveBtn(eventTime.end.btn)
        }
    }

    infoContainer.classList.add("_show");
}

calculateCurrentWeek();