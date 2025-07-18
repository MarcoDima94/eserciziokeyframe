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
    let currentOpenListId = null;
    let unsubscribeFromTasks = null;

    // --- 3. RIFERIMENTI AL DOM ---
    const views = {
        splash: document.getElementById('splash-view'),
        home: document.getElementById('home-view'),
        dashboard: document.getElementById('list-dashboard-view'),
        task: document.getElementById('task-view'),
        profile: document.getElementById('profile-view'),
        login: document.getElementById('login-view'),
        register: document.getElementById('register-view'),
        shareModal: document.getElementById('share-modal')
    };

    // --- 4. FUNZIONI DI CONTROLLO E RENDER ---
    
    function navigateTo(viewId) {
        if (unsubscribeFromTasks) {
            unsubscribeFromTasks();
            unsubscribeFromTasks = null;
        }
        Object.values(views).forEach(view => view.classList.remove('active'));
        if (views[viewId]) views[viewId].classList.add('active');
    }

    async function updateUI() {
        if (currentUser) {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            userProfile = userDoc.exists ? userDoc.data() : null;
            renderHome();
            navigateTo('home');
        } else {
            userProfile = null;
            renderSplash();
            navigateTo('splash');
        }
    }

    // ... (Le altre funzioni di render HTML sono identiche, omesse per brevità)
    function renderSplash() { /* ... */ }
    function renderHome() { /* ... */ }
    function renderLoginForm() { /* ... */ }
    function renderRegisterForm() { /* ... */ }
    async function renderProfile() { /* ... */ }
    async function renderDashboard(categoryName, categoryId) { /* ... */ }

    async function renderTaskView(listId, listName) {
        console.log(`DEBUG: Tentativo di aprire la vista task per la lista ID: ${listId}`);
        currentOpenListId = listId;
        views.task.innerHTML = `
            <header class="view-header"><button class="back-btn" data-target="dashboard"><i class="fas fa-arrow-left"></i></button><h1>${listName}</h1></header>
            <ul class="task-list" id="task-list-container"><li>Caricamento attività...</li></ul>
            <form id="add-task-form">
                <input type="text" id="task-input" class="form-input" style="padding-left: 16px;" placeholder="Nuova attività..." required>
                <button type="submit" class="form-btn"><i class="fas fa-plus"></i></button>
            </form>`;
        navigateTo('task');

        console.log("DEBUG: Imposto il listener onSnapshot per i task.");
        try {
            // PROVA CON UNA QUERY SEMPLIFICATA (SENZA ORDERBY)
            unsubscribeFromTasks = db.collection('tasks').where('listId', '==', listId)
              .onSnapshot(snapshot => {
                console.log(`DEBUG: onSnapshot ha ricevuto ${snapshot.size} documenti.`);
                const taskContainer = document.getElementById('task-list-container');
                if (!taskContainer) return; 
                if (snapshot.empty) {
                    taskContainer.innerHTML = '<li>Nessuna attività in questa lista.</li>';
                    return;
                }
                taskContainer.innerHTML = snapshot.docs.map(doc => {
                    const task = { id: doc.id, ...doc.data() };
                    return `
                        <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                            <span class="task-checkbox"><i class="fas fa-check"></i></span>
                            <span class="task-text">${task.text}</span>
                            <button class="delete-task-btn"><i class="fas fa-times"></i></button>
                        </li>`;
                }).join('');
            }, error => {
                console.error("!!! ERRORE DIRETTO DAL LISTENER onSnapshot:", error);
                alert("Errore nel caricamento delle attività. Controlla la console per i dettagli.");
            });
        } catch (e) {
            console.error("!!! ERRORE nel tentativo di creare il listener:", e);
        }
    }

    // ... (Tutte le altre funzioni logiche sono identiche, omesse per brevità)
    // ... (La gestione degli eventi è identica, omessa per brevità)

    // --- 6. PUNTO DI INGRESSO ---
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateUI();
    });
});

// Per semplicità, incollo qui le funzioni omesse che sono rimaste invariate
// In questo modo puoi copiare l'intero blocco
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
    let currentOpenListId = null;
    let unsubscribeFromTasks = null;

    // --- 3. RIFERIMENTI AL DOM ---
    const views = {
        splash: document.getElementById('splash-view'),
        home: document.getElementById('home-view'),
        dashboard: document.getElementById('list-dashboard-view'),
        task: document.getElementById('task-view'),
        profile: document.getElementById('profile-view'),
        login: document.getElementById('login-view'),
        register: document.getElementById('register-view'),
        shareModal: document.getElementById('share-modal')
    };

    // --- 4. FUNZIONI DI CONTROLLO E RENDER ---
    
    function navigateTo(viewId) {
        if (unsubscribeFromTasks) {
            unsubscribeFromTasks();
            unsubscribeFromTasks = null;
        }
        Object.values(views).forEach(view => view.classList.remove('active'));
        if (views[viewId]) views[viewId].classList.add('active');
    }

    async function updateUI() {
        if (currentUser) {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            userProfile = userDoc.exists ? userDoc.data() : null;
            renderHome();
            navigateTo('home');
        } else {
            userProfile = null;
            renderSplash();
            navigateTo('splash');
        }
    }

    function renderSplash() {
        views.splash.innerHTML = `
            <div class="splash-content">
                <img src="https://i.imgur.com/gIunJ6E.png" alt="Logo TodoApp" class="logo-img">
                <div class="splash-actions">
                    <button id="splash-login-btn" class="splash-btn">Login</button>
                    <button id="splash-register-btn" class="splash-btn secondary">Registrati</button>
                </div>
            </div>`;
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
            <header class="view-header"><button class="back-btn" data-target="splash"><i class="fas fa-arrow-left"></i></button><h1>Login</h1></header>
            <form id="login-form" class="form-container">
                <div class="input-group"><i class="fas fa-envelope"></i><input class="form-input" name="email" type="email" placeholder="Email" required></div>
                <div class="input-group"><i class="fas fa-lock"></i><input class="form-input" name="password" type="password" placeholder="Password" required></div>
                <button type="submit" class="form-btn">Accedi</button>
            </form>`;
        navigateTo('login');
    }

    function renderRegisterForm() {
        views.register.innerHTML = `
            <header class="view-header"><button class="back-btn" data-target="splash"><i class="fas fa-arrow-left"></i></button><h1>Registrati</h1></header>
            <form id="register-form" class="form-container">
                <div class="input-group"><i class="fas fa-user"></i><input class="form-input" name="nome" type="text" placeholder="Nome" required></div>
                <div class="input-group"><i class="fas fa-user-friends"></i><input class="form-input" name="cognome" type="text" placeholder="Cognome" required></div>
                <div class="input-group"><i class="fas fa-envelope"></i><input class="form-input" name="email" type="email" placeholder="Email" required></div>
                <div class="input-group"><i class="fas fa-lock"></i><input class="form-input" name="password" type="password" minlength="6" placeholder="Password (min. 6 caratteri)" required></div>
                <div class="input-group"><i class="fas fa-check-double"></i><input class="form-input" name="passwordConfirm" type="password" placeholder="Conferma Password" required></div>
                <button type="submit" class="form-btn">Crea Account</button>
            </form>`;
        navigateTo('register');
    }

    async function renderProfile() {
        views.profile.innerHTML = `
            <header class="view-header"><button class="back-btn" data-target="home"><i class="fas fa-arrow-left"></i></button><h1>Profilo</h1></header>
            <div class="profile-info"><i class="fas fa-user-circle"></i><p>${currentUser.email}</p></div>
            <div class="friends-section">
                <h3><i class="fas fa-users"></i> I tuoi Amici</h3>
                <form id="add-friend-form" class="input-group">
                    <i class="fas fa-search"></i>
                    <input type="email" id="friend-email-input" class="form-input" placeholder="Email amico da aggiungere" required>
                    <button type="submit" class="icon-btn" style="position:absolute; right: 5px; top: 50%; transform: translateY(-50%);"><i class="fas fa-plus"></i></button>
                </form>
                <div id="friends-list">Caricamento amici...</div>
            </div>
            <button id="logout-btn" class="form-btn logout-btn"><i class="fas fa-sign-out-alt"></i> Esci</button>`;
        navigateTo('profile');
        await loadFriends();
    }

    async function renderDashboard(categoryName, categoryId) {
        views.dashboard.innerHTML = `<header class="view-header"><button class="back-btn" data-target="home"><i class="fas fa-arrow-left"></i></button><h1>${categoryName}</h1></header><p>Caricamento liste...</p>`;
        navigateTo('dashboard');
        
        try {
            const querySnapshot = await db.collection('lists')
                .where('categoryId', '==', String(categoryId))
                .where('members', 'array-contains', currentUser.uid)
                .get();
            
            const lists = [];
            querySnapshot.forEach(doc => lists.push({ id: doc.id, ...doc.data() }));

            const contentHTML = lists.length 
                ? `<div class="list-card-grid">${lists.map(l => `
                    <div class="list-card">
                        <span class="list-card-title" data-list-id="${l.id}" data-list-name="${l.name}">${l.name}</span>
                        <div class="list-card-actions">
                            <button class="icon-btn share-list-btn" data-list-id="${l.id}" title="Condividi"><i class="fas fa-share-alt"></i></button>
                            <button class="icon-btn delete-list-btn" data-list-id="${l.id}" title="Elimina"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>`).join('')}</div>` 
                : `<p>Nessuna lista creata. Clicca il + per iniziare!</p>`;
            
            views.dashboard.innerHTML = `
                <header class="view-header"><button class="back-btn" data-target="home"><i class="fas fa-arrow-left"></i></button><h1>${categoryName}</h1></header>
                ${contentHTML}
                <button class="fab" data-category-name="${categoryName}" data-category-id="${categoryId}" title="Crea nuova lista"><i class="fas fa-plus"></i></button>`;

        } catch (error) {
            console.error("Errore nel caricare le liste: ", error);
            views.dashboard.innerHTML += `<p style="color:red;">Impossibile caricare le liste. Potrebbe essere necessario creare un Indice su Firebase.</p>`;
        }
    }

    async function renderTaskView(listId, listName) {
        console.log(`DEBUG: Tentativo di aprire la vista task per la lista ID: ${listId}`);
        currentOpenListId = listId;
        views.task.innerHTML = `
            <header class="view-header"><button class="back-btn" data-target="dashboard"><i class="fas fa-arrow-left"></i></button><h1>${listName}</h1></header>
            <ul class="task-list" id="task-list-container"><li>Caricamento attività...</li></ul>
            <form id="add-task-form">
                <input type="text" id="task-input" class="form-input" style="padding-left: 16px;" placeholder="Nuova attività..." required>
                <button type="submit" class="form-btn"><i class="fas fa-plus"></i></button>
            </form>`;
        navigateTo('task');

        console.log("DEBUG: Imposto il listener onSnapshot per i task.");
        try {
            // PROVA CON UNA QUERY SEMPLIFICATA (SENZA ORDERBY)
            unsubscribeFromTasks = db.collection('tasks').where('listId', '==', listId)
              .onSnapshot(snapshot => {
                console.log(`DEBUG: onSnapshot ha ricevuto ${snapshot.size} documenti.`);
                const taskContainer = document.getElementById('task-list-container');
                if (!taskContainer) return; 
                if (snapshot.empty) {
                    taskContainer.innerHTML = '<li>Nessuna attività in questa lista.</li>';
                    return;
                }
                const tasks = [];
                snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
                // Ordiniamo i task qui nel codice, invece che nella query
                tasks.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

                taskContainer.innerHTML = tasks.map(task => {
                    return `
                        <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                            <span class="task-checkbox"><i class="fas fa-check"></i></span>
                            <span class="task-text">${task.text}</span>
                            <button class="delete-task-btn"><i class="fas fa-times"></i></button>
                        </li>`;
                }).join('');
            }, error => {
                console.error("!!! ERRORE DIRETTO DAL LISTENER onSnapshot:", error);
                alert("Errore nel caricamento delle attività. Controlla la console per i dettagli.");
            });
        } catch (e) {
            console.error("!!! ERRORE nel tentativo di creare il listener:", e);
        }
    }

    async function createNewList(categoryName, categoryId) {
        const listName = prompt("Come vuoi chiamare la nuova lista?");
        if (!listName) return;
        try {
            await db.collection('lists').add({ name: listName, ownerId: currentUser.uid, categoryId: String(categoryId), members: [currentUser.uid], createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            await renderDashboard(categoryName, categoryId);
        } catch (error) { alert("Errore nella creazione della lista."); }
    }

    async function deleteList(listId) {
        const listRef = db.collection('lists').doc(listId);
        const listDoc = await listRef.get();
        if(listDoc.data().ownerId !== currentUser.uid) return alert("Solo il proprietario può eliminare una lista.");
        if (!confirm("Sei sicuro di voler eliminare questa lista e tutte le sue attività? L'azione è irreversibile.")) return;
        try {
            const taskQuery = await db.collection('tasks').where('listId', '==', listId).get();
            const batch = db.batch();
            taskQuery.docs.forEach(doc => batch.delete(doc.ref));
            batch.delete(listRef);
            await batch.commit();
            document.querySelector(`.list-card-title[data-list-id="${listId}"]`).closest('.list-card').remove();
        } catch (error) { alert("Errore eliminazione lista."); }
    }

    async function addTask(text) {
        if (!text.trim() || !currentOpenListId) return;
        try {
            await db.collection('tasks').add({ text: text, listId: currentOpenListId, completed: false, createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: currentUser.uid });
            document.getElementById('task-input').value = '';
        } catch(error) { alert("Errore nell'aggiungere l'attività."); }
    }

    async function toggleTask(taskId) {
        const taskRef = db.collection('tasks').doc(taskId);
        const taskDoc = await taskRef.get();
        await taskRef.update({ completed: !taskDoc.data().completed });
    }

    async function deleteTask(taskId) {
        await db.collection('tasks').doc(taskId).delete();
    }

    async function addFriend(friendEmail) {
        if (friendEmail.toLowerCase() === currentUser.email) return alert("Non puoi aggiungere te stesso!");
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('email', '==', friendEmail.toLowerCase()).get();
        if (querySnapshot.empty) return alert("Utente non trovato.");
        const friendId = querySnapshot.docs[0].id;
        const friendData = querySnapshot.docs[0].data();
        await usersRef.doc(currentUser.uid).collection('friends').doc(friendId).set({ email: friendData.email, firstName: friendData.firstName });
        await usersRef.doc(friendId).collection('friends').doc(currentUser.uid).set({ email: userProfile.email, firstName: userProfile.firstName });
        alert("Amico aggiunto!");
        await loadFriends();
    }

    async function loadFriends() {
        const friendsListDiv = document.getElementById('friends-list');
        const snapshot = await db.collection('users').doc(currentUser.uid).collection('friends').get();
        if (snapshot.empty) { friendsListDiv.innerHTML = "<p>Nessun amico aggiunto.</p>"; return; }
        friendsListDiv.innerHTML = snapshot.docs.map(doc => `<div class="friend-item">${doc.data().firstName} (${doc.data().email})</div>`).join('');
    }

    async function openShareModal(listId) {
        currentOpenListId = listId;
        const friendsListContainer = document.getElementById('friends-list-container');
        friendsListContainer.innerHTML = "<p>Caricamento amici...</p>";
        views.shareModal.classList.add('active');
        const friendsSnapshot = await db.collection('users').doc(currentUser.uid).collection('friends').get();
        if (friendsSnapshot.empty) { friendsListContainer.innerHTML = "<p>Nessun amico da selezionare.</p>"; return; }
        const listDoc = await db.collection('lists').doc(listId).get();
        const currentMembers = listDoc.data().members || [];
        const friendData = friendsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        friendsListContainer.innerHTML = friendData.map(friend => {
            const isMember = currentMembers.includes(friend.id);
            return `<label class="friend-share-item"><input type="checkbox" value="${friend.id}" ${isMember ? 'checked' : ''}><span>${friend.firstName} (${friend.email})</span></label>`;
        }).join('');
    }

    async function confirmShare() {
        const selectedCheckboxes = document.querySelectorAll('#friends-list-container input[type="checkbox"]:checked');
        const newMemberIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        newMemberIds.push(currentUser.uid);
        await db.collection('lists').doc(currentOpenListId).update({ members: Array.from(new Set(newMemberIds)) });
        alert("Condivisioni salvate!");
        views.shareModal.classList.remove('active');
    }

    // --- 5. GESTIONE EVENTI ---
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        const button = target.closest('button');
        const listTitle = target.closest('.list-card-title');
        const taskItem = target.closest('.task-item');
        if (button) {
            if (button.id === 'splash-login-btn') renderLoginForm();
            else if (button.id === 'splash-register-btn') renderRegisterForm();
            else if (button.classList.contains('back-btn')) {
                const targetView = button.dataset.target;
                if (targetView === 'dashboard') {
                    const lastCategory = JSON.parse(sessionStorage.getItem('lastCategory'));
                    if(lastCategory) await renderDashboard(lastCategory.name, lastCategory.id);
                } else { navigateTo(targetView); }
            }
            else if (button.id === 'profile-btn') await renderProfile();
            else if (button.id === 'logout-btn') await auth.signOut();
            else if (button.classList.contains('fab')) await createNewList(button.dataset.categoryName, button.dataset.categoryId);
            else if (button.classList.contains('delete-list-btn')) await deleteList(button.dataset.listId);
            else if (button.classList.contains('share-list-btn')) await openShareModal(button.dataset.listId);
            else if (button.classList.contains('modal-close-btn')) views.shareModal.classList.remove('active');
            else if (button.id === 'confirm-share-btn') await confirmShare();
            else if (button.classList.contains('delete-task-btn') && taskItem) await deleteTask(taskItem.dataset.taskId);
        }
        if (listTitle) { await renderTaskView(listTitle.dataset.listId, listTitle.dataset.listName); }
        const categoryBtn = target.closest('.category-btn');
        if (categoryBtn) {
            sessionStorage.setItem('lastCategory', JSON.stringify({name: categoryBtn.dataset.name, id: categoryBtn.dataset.id}));
            await renderDashboard(categoryBtn.dataset.name, categoryBtn.dataset.id);
        }
        if (taskItem && target.closest('.task-checkbox')) { await toggleTask(taskItem.dataset.taskId); }
    });

    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.id === 'login-form') {
            const inputs = Object.fromEntries(new FormData(form));
            try { await auth.signInWithEmailAndPassword(inputs.email, inputs.password); } 
            catch (error) { alert(error.message); }
        } else if (form.id === 'register-form') {
            const inputs = Object.fromEntries(new FormData(form));
            if (inputs.password !== inputs.passwordConfirm) { return alert("Le password non coincidono. Riprova."); }
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(inputs.email, inputs.password);
                await db.collection('users').doc(userCredential.user.uid).set({ firstName: inputs.nome, lastName: inputs.cognome, email: inputs.email.toLowerCase() });
                alert('Registrazione avvenuta! Ora puoi fare il login.');
                renderLoginForm();
            } catch (error) { alert(error.message); }
        }
        else if (form.id === 'add-task-form') { await addTask(document.getElementById('task-input').value); }
        else if (form.id === 'add-friend-form') {
            await addFriend(document.getElementById('friend-email-input').value);
            form.reset();
        }
    });

    // --- 6. PUNTO DI INGRESSO ---
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateUI();
    });
});