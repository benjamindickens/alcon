const navigation = {
    navigationLinks: document.querySelectorAll("[data-navigate]"),
    handleNavigation(link) {
        const negativeMargin = ((isMobile) ? 3 : 6) * currentRem;
        const navTarget = link.dataset.navigation;
        const elementPosition = document.querySelector(`[data-${navTarget}]`).getBoundingClientRect().top + window.scrollY - negativeMargin;
        window.scrollTo({top: elementPosition, behavior: 'smooth'});
    },
    initNavigation() {
        this.navigationLinks.forEach(link => link.addEventListener("click", (event) => {
            this.handleNavigation(link);
        }));
    }
}

navigation.initNavigation();