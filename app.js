// ZaLo Market - Logic Engine

function showScreen(screenId) {
    // Hide all screens
    const screens = ['screen-login', 'screen-municipalities', 'screen-stores', 'screen-categories', 'screen-products', 'screen-product-detail'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

// Initial state
window.addEventListener('load', () => {
    // We start at the login screen
    showScreen('screen-login');
});

// Global exports for HTML onclicks
window.showScreen = showScreen;

// Firebase integration placeholder (to be expanded for dynamic data)
async function loadRealData() {
    // This will be used to pull real municipalities, stores, and products from Firestore
    // For now, the UI navigation is the priority to match the 100% design requirement
}
