// ZaLo Market - Logic Engine v2.0

// --- إدارة الشاشات والتنقل ---
function showScreen(screenId) {
    const screens = ['screen-login', 'screen-municipalities', 'screen-stores', 'screen-categories', 'screen-products', 'screen-product-detail', 'screen-admin-login', 'screen-admin-dashboard'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu-dropdown');
    if (menu) menu.classList.toggle('hidden');
}

// --- نظام الرمز السري (PIN Vault) ---
let currentPin = '';
const ADMIN_PIN = '123456'; // الرمز السري للمدير (للعرض التوضيحي)

function openPinModal() {
    toggleMenu(); // إخفاء القائمة
    document.getElementById('pin-modal').classList.remove('hidden');
    clearPin();
}

function closePinModal() {
    document.getElementById('pin-modal').classList.add('hidden');
    clearPin();
}

function pressKey(num) {
    if (currentPin.length < 6) {
        currentPin += num;
        updatePinDisplay();
        
        if (currentPin.length === 6) {
            checkPin();
        }
    }
}

function clearPin() {
    currentPin = '';
    updatePinDisplay();
}

function updatePinDisplay() {
    for (let i = 0; i < 6; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            if (i < currentPin.length) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        }
    }
}

function checkPin() {
    setTimeout(() => {
        if (currentPin === ADMIN_PIN) {
            closePinModal();
            showScreen('screen-admin-login');
        } else {
            alert('الرمز السري غير صحيح!');
            clearPin();
        }
    }, 200);
}

// --- إدارة دخول المدير (Firebase Auth) ---
async function handleAdminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    if (!email || !password) {
        alert('يرجى إدخال البريد وكلمة المرور');
        return;
    }
    
    try {
        if (window.firebaseAuthTools) {
            const { signInWithEmailAndPassword } = window.firebaseAuthTools;
            await signInWithEmailAndPassword(window.firebaseAuth, email, password);
            showScreen('screen-admin-dashboard');
            loadAdminData();
        } else {
            alert('نظام التحقق غير متصل');
        }
    } catch (error) {
        alert('فشل الدخول: تأكد من صحة البيانات');
        console.error(error);
    }
}

function handleAdminLogout() {
    if (window.firebaseAuthTools) {
        window.firebaseAuthTools.signOut(window.firebaseAuth).then(() => {
            showScreen('screen-login');
        });
    }
}

// --- لوحة تحكم المدير (Dashboard) ---
function loadAdminData() {
    if (!window.firebaseDB) return;
    
    const { collection, onSnapshot, query, orderBy } = window.firestoreTools;
    const q = query(collection(window.firebaseDB, "orders"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        document.getElementById('stat-orders').innerText = snapshot.size;
        
        const list = document.getElementById('orders-list');
        list.innerHTML = '';
        
        if (snapshot.empty) {
            list.innerHTML = '<div class="bg-white p-6 rounded-2xl text-center text-gray-400 font-bold">لا توجد طلبات حالياً</div>';
            return;
        }
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('ar-DZ') : 'غير محدد';
            
            list.innerHTML += `
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-black text-lg">${data.product}</h4>
                        <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">قيد الانتظار</span>
                    </div>
                    <p class="text-gold-primary font-bold mb-3">${data.price}</p>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p><i class="fas fa-user ml-2"></i>${data.customerName}</p>
                        <p><i class="fas fa-phone ml-2"></i>${data.customerPhone}</p>
                        <p><i class="fas fa-map-marker-alt ml-2"></i>${data.customerAddress}</p>
                    </div>
                </div>
            `;
        });
    });
}

// --- نظام الطلبات ---
let currentProduct = '';
let currentPrice = '';

function openOrderModal(name, price) {
    currentProduct = name;
    currentPrice = price;
    document.getElementById('order-modal').classList.remove('hidden');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

async function submitOrder() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address) {
        alert('يرجى ملء كافة البيانات');
        return;
    }

    try {
        if (window.firebaseDB) {
            const { collection, addDoc } = window.firestoreTools;
            await addDoc(collection(window.firebaseDB, "orders"), {
                customerName: name,
                customerPhone: phone,
                customerAddress: address,
                product: currentProduct,
                price: currentPrice,
                status: 'pending',
                createdAt: new Date()
            });
            
            alert('تم استلام طلبك بنجاح!');
            closeOrderModal();
        }
    } catch (error) {
        alert('حدث خطأ، يرجى المحاولة لاحقاً');
    }
}

// --- التهيئة ---
window.addEventListener('load', () => {
    // استرجاع الشعار من الصفحة الأولى ووضعه في القوائم
    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        const smallLogos = document.querySelectorAll('.main-logo-small');
        smallLogos.forEach(img => img.src = mainLogo.src);
    }
    showScreen('screen-login');
});

// تصدير الوظائف
window.showScreen = showScreen;
window.toggleMenu = toggleMenu;
window.openPinModal = openPinModal;
window.closePinModal = closePinModal;
window.pressKey = pressKey;
window.clearPin = clearPin;
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.submitOrder = submitOrder;
