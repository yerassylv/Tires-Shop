const API_BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

// Проверка роли администратора
const checkAdmin = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const user = await res.json();

        if (user.role !== "admin") {
            window.location.href = "/"; // Перенаправление на главную страницу, если пользователь не администратор
        }
    } catch (error) {
        console.error("Error checking admin role:", error);
        window.location.href = "/login";
    }
};

// Загрузка продуктов
const loadProducts = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/products`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
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
};

// Загрузка пользователей
const loadUsers = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
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
                <button onclick="editUser('${user._id}')">Edit</button>
                <button onclick="deleteUser('${user._id}')">Delete</button>
            `;
            userList.appendChild(userElement);
        });
    } catch (error) {
        console.error("Error loading users:", error);
    }
};

// Функции для редактирования и удаления продуктов и пользователей
const editProduct = (id) => {
    // Логика для редактирования продукта
};

const deleteProduct = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        loadProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};

const editUser = (id) => {
    // Логика для редактирования пользователя
};

const deleteUser = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/auth/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        loadUsers();
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