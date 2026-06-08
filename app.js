// ZaLo Smart Marketplace - JavaScript Engine (app.js)

let state = {
    currentUser: null,
    currentRole: "CUSTOMER",
    activeTab: "customer",
    products: [],
    stores: [],
    orders: []
};

// --- Auth Functions ---
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
        await signInWithEmailAndPassword(window.firebaseAuth, email, password);
    } catch (error) {
        showError("خطأ: " + error.message);
    }
}

async function handleLogout() {
    const { signOut } = window.firebaseAuthTools;
    await signOut(window.firebaseAuth);
    location.reload();
}

function showError(msg) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
}

// --- Tab Management ---
function switchTab(tabId) {
    state.activeTab = tabId;
    
    // Update UI Buttons
    ['customer', 'merchant', 'admin'].forEach(id => {
        const btn = document.getElementById('tab-' + id);
        if (btn) {
            if (id === tabId) {
                btn.className = "px-3 py-1.5 rounded-full text-xs font-bold bg-zalo-emerald text-white";
            } else {
                btn.className = "px-3 py-1.5 rounded-full text-xs font-bold text-gray-400";
            }
        }
    });
    
    renderContent();
}

// --- Content Rendering ---
function renderContent() {
    const content = document.getElementById('app-content');
    if (state.activeTab === 'customer') {
        renderCustomerView(content);
    } else if (state.activeTab === 'merchant') {
        renderMerchantView(content);
    } else if (state.activeTab === 'admin') {
        renderAdminView(content);
    }
}

function renderCustomerView(container) {
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="col-span-2">
                <h2 class="text-xl font-bold mb-4">المنتجات المميزة</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="products-list">
                    <!-- Products will be loaded here from Firebase -->
                    <div class="bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse h-40"></div>
                    <div class="bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse h-40"></div>
                </div>
            </div>
            <div class="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                <h3 class="font-bold mb-4"><i class="fas fa-robot text-zalo-emerald mr-2"></i> مساعد AI</h3>
                <p class="text-xs text-gray-400">بناءً على موقعك في الجزائر، نقترح عليك تجربة المنتجات الطازجة اليوم.</p>
                <button class="w-full mt-4 bg-zalo-emerald/10 text-zalo-emerald py-2 rounded-lg text-sm font-bold">تحدث مع المساعد</button>
            </div>
        </div>
    `;
    loadProducts();
}

function renderMerchantView(container) {
    container.innerHTML = `
        <div class="text-center py-10">
            <i class="fas fa-store text-5xl text-blue-500 mb-4"></i>
            <h2 class="text-2xl font-bold">بوابة التاجر المحترف</h2>
            <p class="text-gray-400 mt-2">قم بإدارة منتجاتك وطلباتك من هنا</p>
            <div class="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div class="text-2xl font-bold">0</div>
                    <div class="text-[10px] text-gray-500">الطلبات الجديدة</div>
                </div>
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div class="text-2xl font-bold">0 دج</div>
                    <div class="text-[10px] text-gray-500">إجمالي المبيعات</div>
                </div>
            </div>
            <button class="mt-8 bg-zalo-emerald text-white px-8 py-3 rounded-xl font-bold">إضافة منتج جديد</button>
        </div>
    `;
}

function renderAdminView(container) {
    container.innerHTML = `
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-user-shield text-purple-500"></i> لوحة تحكم المدير
            </h2>
            <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div><p class="font-bold">طلبات توثيق التجار</p><p class="text-[10px] text-gray-500">3 طلبات بانتظار المراجعة</p></div>
                    <button class="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg">عرض</button>
                </div>
                <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div><p class="font-bold">إدارة المستخدمين</p><p class="text-[10px] text-gray-500">مراقبة النشاط وتعديل الصلاحيات</p></div>
                    <button class="text-xs bg-purple-500 text-white px-3 py-1.5 rounded-lg">إدارة</button>
                </div>
            </div>
        </div>
    `;
}

// --- Data Loading ---
async function loadProducts() {
    const list = document.getElementById('products-list');
    if (!list) return;

    try {
        const { collection, getDocs } = window.firestoreTools;
        const querySnapshot = await getDocs(collection(window.firebaseDB, "products"));
        
        if (querySnapshot.empty) {
            list.innerHTML = `<p class="text-gray-500 text-sm">لا توجد منتجات حالياً</p>`;
            return;
        }

        list.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            list.innerHTML += `
                <div class="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-zalo-emerald/50 transition-all">
                    <img src="${p.imageUrl || 'https://via.placeholder.com/150'}" class="w-full h-32 object-cover rounded-lg mb-3">
                    <h3 class="font-bold text-sm">${p.name}</h3>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-zalo-emerald font-bold">${p.price} دج</span>
                        <button class="bg-white/10 p-2 rounded-lg"><i class="fas fa-cart-plus text-xs"></i></button>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        list.innerHTML = `<p class="text-red-400 text-xs">خطأ في تحميل البيانات</p>`;
    }
}

// --- Auth State Listener ---
window.addEventListener('load', () => {
    const { onAuthStateChanged } = window.firebaseAuthTools;
    
    onAuthStateChanged(window.firebaseAuth, async (user) => {
        if (user) {
            state.currentUser = user;
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            renderContent();
        } else {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('main-app').classList.add('hidden');
        }
    });
});

// Global exports for HTML onclicks
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.switchTab = switchTab;
