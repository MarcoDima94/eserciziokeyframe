document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP FIREBASE ---
    const firebaseConfig = {
      apiKey: "AIzaSyCuXX5CEkan_lpgAuHVDtAZa0TJSoUpDNQ",
      authDomain: "todo-9773a.firebaseapp.com",
      projectId: "todo-9773a",
      storageBucket: "todo-9773a.appspot.com",
      messagingSenderId: "612007292453",
      appId: "1:612007292453:web:b92b4727a4d1665bec59cc",
      measurementId: "G-J8X9ZQBVWP"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- 2. STATO GLOBALE ---
    let currentUser = null; 
    let userProfile = null; 

    // --- 3. RIFERIMENTI AL DOM ---
    const views = {
        splash: document.getElementById('splash-view'),
        home: document.getElementById('home-view'),
        dashboard: document.getElementById('list-dashboard-view'),
        profile: document.getElementById('profile-view'),
        login: document.getElementById('login-view'),
        register: document.getElementById('register-view'),
    };

    // --- 4. FUNZIONI DI CONTROLLO E RENDER ---

    function navigateTo(viewId) {
        for (const key in views) {
            views[key].classList.remove('active');
        }
        views[viewId]?.classList.add('active');
    }

    async function updateUI() {
        if (currentUser) {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                userProfile = userDoc.data();
            }
            renderHome();
            navigateTo('home');
        } else {
            userProfile = null;
            navigateTo('splash');
        }
    }

    function renderHome() {
        const userName = userProfile?.firstName || 'Utente';
        views.home.innerHTML = `
            <header class="home-header">
                <div id="welcome-message">Benvenuto, ${userName}!</div>
                <button id="profile-btn" class="icon-btn" title="Profilo"><i class="fas fa-user"></i></button>
            </header>
            <div class="category-grid">
                <div class="category-btn" data-name="Lavoro" data-id="1"><i class="fas fa-briefcase"></i><span>Lavoro</span></div>
                <div class="category-btn" data-name="Casa" data-id="2"><i class="fas fa-home"></i><span>Casa</span></div>
                <div class="category-btn" data-name="Spesa" data-id="3"><i class="fas fa-shopping-cart"></i><span>Spesa</span></div>
                <div class="category-btn" data-name="Appuntamenti" data-id="4"><i class="fas fa-calendar-alt"></i><span>Appuntamenti</span></div>
            </div>`;
    }

    function renderLoginForm() {
        views.login.innerHTML = `
            <header class="view-header">
                <button class="back-btn" data-target="splash"><i class="fas fa-arrow-left"></i></button>
                <h1>Login</h1>
            </header>
            <form id="login-form" class="form-container">
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input class="form-input" name="email" type="email" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input class="form-input" name="password" type="password" placeholder="Password" required>
                </div>
                <button type="submit" class="form-btn">Accedi</button>
            </form>`;
        navigateTo('login');
    }

    function renderRegisterForm() {
        views.register.innerHTML = `
            <header class="view-header">
                <button class="back-btn" data-target="splash"><i class="fas fa-arrow-left"></i></button>
                <h1>Registrati</h1>
            </header>
            <form id="register-form" class="form-container">
                <div class="input-group">
                    <i class="fas fa-user"></i>
                    <input class="form-input" name="nome" type="text" placeholder="Nome" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-user-friends"></i>
                    <input class="form-input" name="cognome" type="text" placeholder="Cognome" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input class="form-input" name="email" type="email" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input class="form-input" name="password" type="password" minlength="6" placeholder="Password (min. 6 caratteri)" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-check-double"></i>
                    <input class="form-input" name="passwordConfirm" type="password" placeholder="Conferma Password" required>
                </div>
                <button type="submit" class="form-btn">Crea Account</button>
            </form>`;
        navigateTo('register');
    }

    function renderProfile() {
        views.profile.innerHTML = `
            <header class="view-header">
                <button class="back-btn" data-target="home"><i class="fas fa-arrow-left"></i></button>
                <h1>Profilo</h1>
            </header>
            <div class="profile-info">
                <i class="fas fa-user-circle"></i>
                <p>${currentUser.email}</p>
            </div>
            <button id="logout-btn" class="form-btn logout-btn"><i class="fas fa-sign-out-alt"></i> Esci</button>`;
        navigateTo('profile');
    }

    async function renderDashboard(categoryName, categoryId) {
        views.dashboard.innerHTML = `
            <header class="view-header">
                <button class="back-btn" data-target="home"><i class="fas fa-arrow-left"></i></button>
                <h1>${categoryName}</h1>
            </header>
            <p>Caricamento...</p>`;
        navigateTo('dashboard');
        
        const lists = [];
        try {
            const querySnapshot = await db.collection('lists').where('ownerId', '==', currentUser.uid).where('categoryId', '==', String(categoryId)).get();
            querySnapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
        } catch (error) {
            console.error("Errore nel caricare le liste: ", error);
            alert("Impossibile caricare le liste. Controlla le regole di sicurezza di Firestore.");
            return;
        }

        const contentHTML = lists.length ? `<div class="list-card-grid">${lists.map(l => `<div class="list-card"><h3>${l.name}</h3></div>`).join('')}</div>` : `<p>Nessuna lista creata. Clicca il + per iniziare!</p>`;
        
        const finalHTML = `
            <header class="view-header"><button class="back-btn" data-target="home"><i class="fas fa-arrow-left"></i></button><h1>${categoryName}</h1></header>
            ${contentHTML}
            <button class="fab" data-category-name="${categoryName}" data-category-id="${categoryId}" title="Crea nuova lista"><i class="fas fa-plus"></i></button>`;
        views.dashboard.innerHTML = finalHTML;
    }

    async function createNewList(categoryName, categoryId) {
        if (!currentUser) return alert("Devi essere loggato per creare una lista.");
        const listName = prompt("Come vuoi chiamare la nuova lista?");
        if (!listName) return;

        try {
            await db.collection('lists').add({
                name: listName,
                ownerId: currentUser.uid,
                categoryId: String(categoryId),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            await renderDashboard(categoryName, categoryId);
        } catch (error) {
            console.error("Errore creazione lista: ", error);
            alert("Errore nella creazione della lista.");
        }
    }

    // --- 5. GESTIONE EVENTI ---
    document.body.addEventListener('click', async (e) => {
        const targetElement = e.target;
        const button = targetElement.closest('button');
        const categoryBtn = targetElement.closest('.category-btn');

        if (button) {
            const id = button.id;
            if (id === 'splash-login-btn') renderLoginForm();
            if (id === 'splash-register-btn') renderRegisterForm();
            if (button.classList.contains('back-btn')) navigateTo(button.dataset.target);
            
            if (currentUser) {
                if (id === 'profile-btn') renderProfile();
                if (id === 'logout-btn') await auth.signOut();
                if (button.classList.contains('fab')) await createNewList(button.dataset.categoryName, button.dataset.categoryId);
            }
        }
        
        if (currentUser && categoryBtn) {
            await renderDashboard(categoryBtn.dataset.name, categoryBtn.dataset.id);
        }
    });

    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const inputs = Object.fromEntries(new FormData(form));

        if (form.id === 'login-form') {
            try {
                await auth.signInWithEmailAndPassword(inputs.email, inputs.password);
            } catch (error) {
                alert(error.message);
            }
        } else if (form.id === 'register-form') {
            if (inputs.password !== inputs.passwordConfirm) {
                alert("Le password non coincidono. Riprova.");
                return;
            }
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(inputs.email, inputs.password);
                await db.collection('users').doc(userCredential.user.uid).set({
                    firstName: inputs.nome,
                    lastName: inputs.cognome,
                    email: inputs.email
                });
                alert('Registrazione avvenuta! Ora puoi fare il login.');
                renderLoginForm();
            } catch (error) {
                alert(error.message);
            }
        }
    });

    // --- 6. PUNTO DI INGRESSO ---
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateUI();
    });
});