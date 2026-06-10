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

// Initial state and event listeners
window.addEventListener('load', () => {
    // We start at the login screen
    showScreen('screen-login');

    // تفعيل أزرار الطلب والتواصل
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.innerText.includes('اطلب الآن')) {
            alert('شكراً لطلبك! سيتم توجيهك لإتمام عملية الدفع وتأكيد الطلب.');
        }
        
        if (btn.innerText.includes('تواصل مع التاجر')) {
            alert('جاري فتح محادثة مباشرة مع التاجر عبر واتساب...');
            window.open('https://wa.me/213000000000', '_blank');
        }
    });
});

// Global exports for HTML onclicks
window.showScreen = showScreen;

// Firebase integration placeholder
async function loadRealData() {
    // This will be used to pull real municipalities, stores, and products from Firestore
}
