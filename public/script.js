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

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const loadProducts = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const products = await res.json();
        const catalog = document.getElementById("catalog");

        catalog.innerHTML = ""; // Очистка каталога перед добавлением новых продуктов

        if (products.length > 0) {
            products.forEach(product => {
                const productElement = document.createElement("div");
                productElement.className = "product";
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.model}">
                    <h3>${product.model}</h3>
                    <p>${product.description}</p>
                    <p>${product.price} USD</p>
                    <button>Add to Cart</button>
                `;
                catalog.appendChild(productElement);
            });
        } else {
            document.getElementById("message").textContent = "No products found.";
        }
    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById("message").textContent = "Error loading products.";
    }
};

// Загрузка продуктов при открытии страницы шин
if (window.location.pathname === "/tires") {
    loadProducts();
}