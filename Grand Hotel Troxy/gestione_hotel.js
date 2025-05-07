const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
];

function login(username, password) {
    try {
        if (!username || !password) {
            throw new Error("Username e password sono obbligatori");
        }

        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            throw new Error("Credenziali errate");
        }

        console.log(`Login effettuato con successo! ${user.role}`);
        return user;
    } catch (error) {
        console.error(`Errore: ${error.message}`);
    }

    document.addEventListener('DOMContentLoaded', function() {
        const formContainer = document.querySelector('.form-container');
    
        window.addEventListener('scroll', function() {
            const rect = formContainer.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                formContainer.classList.add('show');
            }
        });
    });
}