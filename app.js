// ZaLo Market - Logic Engine

// إدارة التنقل بين الشاشات
function showScreen(screenId) {
    const screens = ['screen-login', 'screen-municipalities', 'screen-stores', 'screen-categories', 'screen-products', 'screen-product-detail'];
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

// إدارة نموذج الطلب
function openOrderModal(name, price) {
    document.getElementById('modal-product-name').innerText = name;
    document.getElementById('modal-product-price').innerText = price + " دج";
    document.getElementById('order-modal').classList.remove('hidden');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

async function submitOrder() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const productName = document.getElementById('modal-product-name').innerText;
    const productPrice = document.getElementById('modal-product-price').innerText;

    if (!name || !phone || !address) {
        alert('يرجى ملء كافة البيانات لإتمام الطلب');
        return;
    }

    try {
        // إرسال الطلب إلى Firestore
        if (window.firebaseDB) {
            const { collection, addDoc } = window.firestoreTools;
            await addDoc(collection(window.firebaseDB, "orders"), {
                customerName: name,
                customerPhone: phone,
                customerAddress: address,
                product: productName,
                price: productPrice,
                status: 'pending',
                createdAt: new Date()
            });
            
            alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً.');
            closeOrderModal();
        } else {
            alert('عذراً، نظام الربط مع السيرفر غير جاهز حالياً.');
        }
    } catch (error) {
        console.error("Error submitting order: ", error);
        alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.');
    }
}

// التواصل مع التاجر
function contactMerchant(productName) {
    const message = `مرحباً، أنا مهتم بشراء ${productName} من تطبيق ZaLo Market. هل هو متوفر؟`;
    const whatsappUrl = `https://wa.me/213000000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// الحالة الأولية
window.addEventListener('load', () => {
    showScreen('screen-login');
});

// تصدير الوظائف
window.showScreen = showScreen;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.submitOrder = submitOrder;
window.contactMerchant = contactMerchant;
