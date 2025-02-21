const API_BASE_URL = "http://localhost:3000";

// **Функция для отправки OTP**
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            message.textContent = data.message;
            message.className = res.ok ? "success" : "error";

            if (res.ok) {
                // Открыть модальное окно для ввода OTP
                document.getElementById("otp-modal").style.display = "block";
            }
        } catch (error) {
            message.textContent = "Error sending OTP.";
            message.className = "error";
        }
    });
}

// **Функция для подтверждения OTP**
const otpForm = document.getElementById("otp-form");
if (otpForm) {
    otpForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("otp-email").value;
        const otp = document.getElementById("otp").value;
        const message = document.getElementById("otp-message");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();
            message.textContent = data.message;
            message.className = res.ok ? "success" : "error";

            if (res.ok) {
                // Вывод сообщения о правильности OTP
                message.textContent = "OTP verified successfully!";
                message.className = "success";

                // Закрыть модальное окно и перенаправить на страницу логина
                setTimeout(() => {
                    document.getElementById("otp-modal").style.display = "none";
                    window.location.href = "/login";
                }, 2000);
            }
        } catch (error) {
            message.textContent = "Error verifying OTP.";
            message.className = "error";
        }
    });
}
// **Функция для логина**
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const message = document.getElementById("message");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            message.textContent = data.message;
            message.className = res.ok ? "success" : "error";

            if (res.ok) {
                localStorage.setItem("token", data.token);
                setTimeout(() => window.location.href = "/profile", 2000);
            }
        } catch (error) {
            message.textContent = "Login failed.";
            message.className = "error";
        }
    });
}

// **Функция для загрузки профиля пользователя**
const loadProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
            document.getElementById("profile-username").textContent = data.username;
            document.getElementById("profile-email").textContent = data.email;
        } else {
            document.getElementById("message").textContent = data.message;
            document.getElementById("message").className = "error";
        }
    } catch (error) {
        document.getElementById("message").textContent = "Error loading profile.";
        document.getElementById("message").className = "error";
    }
}

// **Функция для выхода из системы**
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    });
}

// Загрузка профиля при открытии страницы профиля
if (window.location.pathname === "/profile") {
    loadProfile();
}

// Логика для открытия и закрытия модального окна
const modal = document.getElementById("otp-modal");
const span = document.getElementsByClassName("close")[0];



window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const filterForm = document.getElementById('filter-form');
if (filterForm) {
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Останавливаем перезагрузку страницы

        const formData = new FormData(event.target);
        let query = [];

        formData.forEach((value, key) => {
            query.push(`${key}=${encodeURIComponent(value)}`);
        });

        loadProducts(1, query.join("&")); // Загружаем продукты с учётом фильтров
    });
}
const loadProducts = async (page = 1, filters = "") => {
    try {
        console.log("Fetching products...");
        const res = await fetch(`${API_BASE_URL}/products?page=${page}&limit=10&${filters}`);
        const data = await res.json();
        const { products, total, pages } = data;
        console.log("Products fetched:", products);
        const catalog = document.getElementById("catalog");

        catalog.innerHTML = ""; // Очистка каталога перед добавлением новых продуктов

        if (products.length > 0) {
            products.forEach(product => {
                const productElement = document.createElement("div");
                productElement.className = "product";
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.model}">
                    <h3>${product.model}</h3>
                    <p>Size: ${product.size}</p>
                    <p>In Stock: ${product.stock}</p>
                    <p>${product.description}</p>
                    <p>${product.price} USD</p>
                    <button onclick="addToCart('${product._id}')">Add to Cart</button>
                    <button>Add to Favorites</button>
                `;
                catalog.appendChild(productElement);
            });
        } else {
            document.getElementById("message").textContent = "No products found.";
        }

        // Добавление элементов пагинации
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        for (let i = 1; i <= pages; i++) {
            const pageElement = document.createElement("button");
            pageElement.textContent = i;
            pageElement.className = i === page ? "active" : "";
            pageElement.onclick = () => loadProducts(i, filters); // ✅ Передаём фильтры при смене страницы
            pagination.appendChild(pageElement);
        }
    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById("message").textContent = "Error loading products.";
    }
};

// Загрузка продуктов при открытии страницы шин
if (window.location.pathname === "/tires") {
    loadProducts(); // ✅ Без фильтров при загрузке
}

// **Функция для добавления товара в корзину**
const addToCart = async (productId) => {
    try {
        const res = await fetch("/cart/api", { // ✅ Теперь отправляем на /cart/api, а не /cart
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Product added to cart successfully!");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

  
const loadCart = async () => {
    try {
        console.log("Loading cart...");
        const res = await fetch("/cart/api", { method: "GET" });

        const data = await res.json();
        console.log("Cart data:", data);

        if (res.ok) {
            const cartList = document.getElementById("cart-list");
            cartList.innerHTML = "";

            let total = 0;
            data.items.forEach(item => {
                const productElement = document.createElement("div");
                productElement.className = "product"; // Используем стили как на /tires
                productElement.innerHTML = `
                    <img src="${item.product.image}" alt="${item.product.model}">
                    <h3>${item.product.model}</h3>
                    <p><strong>Brand:</strong> ${item.product.brand}</p>
                    <p><strong>Size:</strong> ${item.product.size}</p>
                    <p><strong>Season:</strong> ${item.product.season}</p>
                    <p><strong>Vehicle Type:</strong> ${item.product.vehicleType}</p>
                    <p><strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Price:</strong> ${item.product.price} USD</p>
                    <button class="remove-btn" onclick="removeFromCart('${item.product._id}')">Remove</button>
                `;
                cartList.appendChild(productElement);
                total += item.product.price * item.quantity;
            });

            document.getElementById("total-price").textContent = `Total: ${total} USD`;
        } else {
            document.getElementById("message").textContent = data.message;
            document.getElementById("message").className = "error";
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        document.getElementById("message").textContent = "Error loading cart.";
        document.getElementById("message").className = "error";
    }
};

// Функция удаления товара из корзины
const removeFromCart = async (productId) => {
    try {
        const res = await fetch(`/cart/api/${productId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        if (res.ok) {
            alert("Product removed from cart!");
            loadCart(); // Перезагружаем корзину
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error removing from cart:", error);
    }
};

// Загружаем корзину при открытии страницы
if (window.location.pathname === "/cart") {
    loadCart();
}

// Загрузка корзины при открытии страницы корзины
if (window.location.pathname === "/cart") {
    loadCart();
}
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("checkout-modal");
    const checkoutButton = document.getElementById("checkout-button");
    const closeModal = document.querySelector(".close");
    const checkoutForm = document.getElementById("checkout-form");
    const deliverySelect = document.getElementById("checkout-delivery");
    const addressField = document.getElementById("address-field");

    // Открытие модального окна
    checkoutButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Закрытие модального окна
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Показать поле "Адрес", если выбрана доставка курьером
    deliverySelect.addEventListener("change", () => {
        if (deliverySelect.value === "courier") {
            addressField.style.display = "block";
        } else {
            addressField.style.display = "none";
        }
    });

    // Отправка данных на сервер
    checkoutForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("checkout-name").value;
        const email = document.getElementById("checkout-email").value;
        const phone = document.getElementById("checkout-phone").value;
        const deliveryMethod = document.getElementById("checkout-delivery").value;
        const address = deliveryMethod === "courier" ? document.getElementById("checkout-address").value : null;
        const messageElement = document.getElementById("checkout-message");

        try {
            const response = await fetch("/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, deliveryMethod, address })
            });

            const data = await response.json();
            messageElement.textContent = data.message;
            messageElement.className = response.ok ? "success" : "error";

            if (response.ok) {
                setTimeout(() => {
                    modal.style.display = "none";
                    window.location.reload(); // Обновить страницу после успешного заказа
                }, 2000);
            }
        } catch (error) {
            messageElement.textContent = "Ошибка при оформлении заказа.";
            messageElement.className = "error";
        }
    });
});
