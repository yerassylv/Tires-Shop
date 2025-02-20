const API_BASE_URL = "http://localhost:3000/auth";

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
            const res = await fetch(`${API_BASE_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            message.textContent = data.message;
            message.className = res.ok ? "success" : "error";
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
        const message = document.getElementById("message");

        try {
            const res = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();
            message.textContent = data.message;
            message.className = res.ok ? "success" : "error";

            if (res.ok) {
                // ✅ Только после успешного ввода OTP перенаправляем на логин
                setTimeout(() => {
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
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            message.textContent = data.message;
            message.className = res.ok ? "success" : "error";

            if (res.ok) {
                localStorage.setItem("token", data.token);
                setTimeout(() => window.location.href = "/dashboard", 2000);
            }
        } catch (error) {
            message.textContent = "Login failed.";
            message.className = "error";
        }
    });
}