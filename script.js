// Configuración de Auth0
let auth0 = null;

async function inicializarAuth() {
    auth0 = await createAuth0Client({
        domain: "TU_DOMINIO", // Reemplazar con datos de tu Dashboard
        client_id: "TU_CLIENT_ID" 
    });

    if (window.location.search.includes("code=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0.getUser();
        document.getElementById("bienvenida").innerText = `¡Hola, ${user.name}!`;
        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-logout").style.display = "inline";
    } else {
        document.getElementById("bienvenida").innerText = "Bienvenido, por favor inicia sesión";
    }
}

const login = async () => {
    await auth0.loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin } });
};

const logout = () => {
    sessionStorage.clear(); // Limpia el carrito por seguridad al salir
    auth0.logout({ logoutParams: { returnTo: window.location.origin } });
};

// Gestión del Carrito con Session Storage
function agregarAlCarrito(nombre, precio) {
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    carrito.push({ nombre, precio });
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${nombre} añadido al carrito.`);
}

// Validación de Formulario (Programación Segura)[cite: 1]
function validarCompra(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    if (!email.includes('@') || isNaN(telefono)) {
        alert("Error de validación: Verifique sus datos.");
        return;
    }

    alert("Compra procesada con éxito.");
    sessionStorage.clear();
    location.reload();
}

window.onload = inicializarAuth;