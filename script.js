document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP FIREBASE ---
    // IMPORTANTE: Incolla qui il tuo oggetto di configurazione di Firebase
    // che hai ottenuto dalla console del tuo progetto.
    const firebaseConfig = {
        apiKey: "TUO_API_KEY",
        authDomain: "TUO_AUTH_DOMAIN",
        projectId: "TUO_PROJECT_ID",
        storageBucket: "TUO_STORAGE_BUCKET",
        messagingSenderId: "TUO_MESSAGING_SENDER_ID",
        appId: "TUO_APP_ID"
    };

    // Inizializzazione di Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- 2. STATO GLOBALE ---
    let currentUser = null; // Conterrà l'utente di Firebase Auth
    let userProfile = null; // Conterrà i dati dell'utente da Firestore (es. nome)

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
            // Se l'utente è loggato, carica il suo profilo da Firestore
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
                <div id="welcome-message">Benvenuto, ${userName}</div>
                <button id="profile-btn" class="icon-btn"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
            </header>
            <div class="category-grid">
                <div class="category-btn" data-name="Lavoro" data-id="1"><svg width="48" height="48" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h3v3H7zM7 14h3v3H7zM14 7h3v3h-3zM14 14h3v3h-3z"/></svg><span>Lavoro</span></div>
                <div class="category-btn" data-name="Casa" data-id="2"><svg width="48" height="48" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><span>Casa</span></div>
                <div class="category-btn" data-name="Spesa" data-id="3"><svg width="48" height="48" viewBox="0 0 24 24"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16"/></svg><span>Spesa</span></div>
                <div class="category-btn" data-name="Appuntamenti" data-id="4"><svg width="48" height="48" viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><span>Appuntamenti</span></div>
            </div>`;
    }

    function renderLoginForm() {
        views.login.innerHTML = `<header class="view-header"><button class="back-btn" data-target="splash"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button><h1>Login</h1></header><form id="login-form" class="form-container"><input name="email" type="email" placeholder="Email" required><input name="password" type="password" placeholder="Password" required><button type="submit" class="form-btn">Accedi</button></form>`;
        navigateTo('login');
    }

    function renderRegisterForm() {
        views.register.innerHTML = `<header class="view-header"><button class="back-btn" data-target="splash"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button><h1>Registrati</h1></header><form id="register-form" class="form-container"><input name="nome" type="text" placeholder="Nome" required><input name="cognome" type="text" placeholder="Cognome" required><input name="email" type="email" placeholder="Email" required><input name="password" minlength="6" type="password" placeholder="Password" required><button type="submit" class="form-btn">Registrati</button></form>`;
        navigateTo('register');
    }

    function renderProfile() {
        views.profile.innerHTML = `<header class="view-header"><button class="back-btn" data-target="home"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button><h1>Profilo</h1></header><div class="profile-info"><p>${currentUser.email}</p></div><button id="logout-btn" class="form-btn logout-btn">Esci</button>`;
        navigateTo('profile');
    }

    async function renderDashboard(categoryName, categoryId) {
        views.dashboard.innerHTML = `<header class="view-header"><button class="back-btn" data-target="home"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button><h1>${categoryName}</h1></header><p>Caricamento...</p>`;
        navigateTo('dashboard');
        
        // CONVERSIONE: da Supabase a Firestore
        const lists = [];
        try {
            const querySnapshot = await db.collection('lists')
                .where('ownerId', '==', currentUser.uid)
                .where('categoryId', '==', categoryId)
                .get();
            querySnapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
        } catch (error) {
            console.error("Errore nel caricare le liste: ", error);
            alert("Impossibile caricare le liste.");
            return;
        }

        const contentHTML = lists.length ? `<div class="list-card-grid">${lists.map(l => `<div class="list-card"><h3>${l.name}</h3></div>`).join('')}</div>` : `<p>Nessuna lista creata. Clicca il + per iniziare!</p>`;
        
        const finalHTML = `
            <header class="view-header"><button class="back-btn" data-target="home"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button><h1>${categoryName}</h1></header>
            ${contentHTML}
            <button class="fab" data-category-name="${categoryName}" data-category-id="${categoryId}"><svg viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg></button>`;
        views.dashboard.innerHTML = finalHTML;
    }

    async function createNewList(categoryName, categoryId) {
        if (!currentUser) return alert("Devi essere loggato per creare una lista.");
        const listName = prompt("Come vuoi chiamare la nuova lista?");
        if (!listName) return;

        try {
            // CONVERSIONE: da Supabase a Firestore
            const newListRef = await db.collection('lists').add({
                name: listName,
                ownerId: currentUser.uid,
                categoryId: categoryId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            // Nella logica originale c'era una tabella `list_members`.
            // Per ora, la proprietà `ownerId` è sufficiente.
            // Se servisse condividere le liste, si potrebbe aggiungere una collection `list_members`.
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
            // CONVERSIONE: Login con Firebase
            try {
                await auth.signInWithEmailAndPassword(inputs.email, inputs.password);
                // L'onAuthStateChange gestirà la navigazione
            } catch (error) {
                alert(error.message);
            }
        } else if (form.id === 'register-form') {
            // CONVERSIONE: Registrazione con Firebase
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(inputs.email, inputs.password);
                // Dopo aver creato l'utente, salvo i dati extra (nome, cognome) in Firestore
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
    // CONVERSIONE: da Supabase a Firebase
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateUI();
    });
});