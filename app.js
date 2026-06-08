// ZaLo Smart Marketplace - JavaScript Engine (app.js)

let state = {
    currentUser: null,
    currentRole: "CUSTOMER",
    activeTab: "customer",
    users: [],
    stores: [],
    products: [],
    orders: []
};

// --- Firebase Auth & Firestore Logic ---
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    if (!email || !password) {
        showError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    try {
        const { signInWithEmailAndPassword } = window.firebaseAuthTools;
        const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        console.log("Logged in successfully:", userCredential.user.email);
    } catch (error) {
        console.error("Login Error:", error.code);
        showError("خطأ في تسجيل الدخول: " + translateError(error.code));
    }
}

function translateError(code) {
    switch(code) {
        case 'auth/user-not-found': return 'المستخدم غير موجود';
        case 'auth/wrong-password': return 'كلمة المرور خاطئة';
        case 'auth/invalid-email': return 'بريد إلكتروني غير صالح';
        default: return 'تأكد من البيانات وحاول مجدداً';
    }
}

function showError(msg) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
}

async function handleLogout() {
    const { signOut } = window.firebaseAuthTools;
    await signOut(window.firebaseAuth);
    location.reload();
}

// --- Auth State Listener ---
window.addEventListener('load', () => {
    const { onAuthStateChanged } = window.firebaseAuthTools;
    
    onAuthStateChanged(window.firebaseAuth, async (user) => {
        if (user) {
            // User is signed in
            state.currentUser = { uid: user.uid, email: user.email };
            
            // Fetch User Role from Firestore
            const { doc, getDoc } = window.firestoreTools;
            const userDoc = await getDoc(doc(window.firebaseDB, "users", user.uid));
            
            if (userDoc.exists()) {
                state.currentRole = userDoc.data().role || "CUSTOMER";
            } else {
                // If user doesn't exist in Firestore, default to CUSTOMER or create doc
                state.currentRole = "CUSTOMER";
            }
            
            showMainApp();
        } else {
            // User is signed out
            showLoginScreen();
        }
    });
});

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    renderDashboard();
}

function renderDashboard() {
    const content = document.getElementById('app-content');
    let html = `
        <div class="text-center py-10">
            <h2 class="text-2xl font-bold">مرحباً بك، ${state.currentUser.email}</h2>
            <p class="text-zalo-emerald font-bold mt-2">رتبتك الحالية: ${state.currentRole}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <i class="fas fa-shopping-cart text-3xl text-zalo-emerald mb-4"></i>
                    <h3 class="text-xl font-bold">المتجر</h3>
                    <p class="text-gray-400 text-sm mt-2">تصفح أحدث المنتجات في السوق</p>
                </div>
                <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <i class="fas fa-store text-3xl text-blue-500 mb-4"></i>
                    <h3 class="text-xl font-bold">بوابة التاجر</h3>
                    <p class="text-gray-400 text-sm mt-2">إدارة مبيعاتك ومنتجاتك</p>
                </div>
                <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <i class="fas fa-user-shield text-3xl text-purple-500 mb-4"></i>
                    <h3 class="text-xl font-bold">الإدارة</h3>
                    <p class="text-gray-400 text-sm mt-2">لوحة تحكم المشرفين</p>
                </div>
            </div>
        </div>
    `;
    content.innerHTML = html;
}
