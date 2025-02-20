const API_BASE_URL = "http://localhost:3000";

// Проверка роли администратора
const checkAdmin = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`);
        const user = await res.json();

        if (user.role !== "admin") {
            window.location.href = "/"; // Перенаправление на главную страницу, если пользователь не администратор
        }
    } catch (error) {
        console.error("Error checking admin role:", error);
        window.location.href = "/login";
    }
};

// Открытие модального окна для добавления продукта
const addProductButton = document.getElementById("add-product");
const productModal = document.getElementById("product-modal");
const closeProductModal = document.getElementsByClassName("close")[0];

addProductButton.onclick = () => {
    productModal.style.display = "block";
};

closeProductModal.onclick = () => {
    productModal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == productModal) {
        productModal.style.display = "none";
    }
};

// Отправка формы для добавления продукта
const productForm = document.getElementById("product-form");
productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("brand", document.getElementById("brand").value);
    formData.append("model", document.getElementById("model").value);
    formData.append("size", document.getElementById("size").value);
    formData.append("season", document.getElementById("season").value);
    formData.append("loadIndex", document.getElementById("loadIndex").value);
    formData.append("speedIndex", document.getElementById("speedIndex").value);
    formData.append("vehicleType", document.getElementById("vehicleType").value);
    formData.append("studded", document.getElementById("studded").checked);
    formData.append("price", document.getElementById("price").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("image", document.getElementById("image").files[0]);

    try {
        const res = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        const message = document.getElementById("product-message");
        message.textContent = data.message;
        message.className = res.ok ? "success" : "error";

        if (res.ok) {
            productModal.style.display = "none";
            loadProducts();
        }
    } catch (error) {
        console.error("Error adding product:", error);
    }
});

// Загрузка продуктов
const loadProducts = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const products = await res.json();
        const productList = document.getElementById("product-list");

        productList.innerHTML = "";
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.className = "product";
            productElement.innerHTML = `
                <h3>${product.model}</h3>
                <p>${product.description}</p>
                <p>${product.price} USD</p>
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
});

// Загрузка пользователей
const loadUsers = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/users`);
        const users = await res.json();
        const userList = document.getElementById("user-list");

        userList.innerHTML = "";
        users.forEach(user => {
            const userElement = document.createElement("div");
            userElement.className = "user";
            userElement.innerHTML = `
                <h3>${user.username}</h3>
                <p>${user.email}</p>
                <p>${user.role}</p>
                <button onclick="changeUserRole('${user._id}', '${user.role === 'admin' ? 'user' : 'admin'}')">Change Role</button>
                <button onclick="deleteUser('${user._id}')">Delete</button>
            `;
            userList.appendChild(userElement);
        });
    } catch (error) {
        console.error("Error loading users:", error);
    }
});

// Изменение роли пользователя
const changeUserRole = async (id, newRole) => {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: newRole })
        });

        if (res.ok) {
            loadUsers();
        } else {
            console.error("Error changing user role");
        }
    } catch (error) {
        console.error("Error changing user role:", error);
    }
};

// Удаление пользователя
const deleteUser = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            loadUsers();
        } else {
            console.error("Error deleting user");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

// Загрузка продуктов и пользователей при открытии страницы админ панели
document.addEventListener("DOMContentLoaded", async () => {
    await checkAdmin();
    loadProducts();
    loadUsers();
});