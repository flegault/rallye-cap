const SDK = "https://www.gstatic.com/firebasejs/11.10.0/";

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseAppCheck = null;
let api = null;

async function loadConfig() {
  if (window.RALLYE_CAP_FIREBASE_CONFIG) return window.RALLYE_CAP_FIREBASE_CONFIG;
  try {
    let mod = await import("./firebase-config.js");
    return mod.default || mod.firebaseConfig || null;
  } catch (e) {
    return null;
  }
}

async function ensureFirebase() {
  if (api) return api;
  let config = await loadConfig();
  if (!config || !config.apiKey || !config.projectId) {
    throw new Error("Firebase n'est pas configuré. Crée firebase-config.js à partir de firebase-config.example.js.");
  }
  let appMod = await import(SDK + "firebase-app.js");
  let authMod = await import(SDK + "firebase-auth.js");
  let fsMod = await import(SDK + "firebase-firestore.js");
  firebaseApp = appMod.initializeApp(config);
  let appCheckSiteKey = config.appCheckSiteKey || config.recaptchaV3SiteKey || config.appCheck?.siteKey || "";
  if (appCheckSiteKey) {
    if (config.appCheckDebugToken) self.FIREBASE_APPCHECK_DEBUG_TOKEN = config.appCheckDebugToken;
    let appCheckMod = await import(SDK + "firebase-app-check.js");
    firebaseAppCheck = appCheckMod.initializeAppCheck(firebaseApp, {
      provider: new appCheckMod.ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  }
  firebaseAuth = authMod.getAuth(firebaseApp);
  firebaseDb = fsMod.getFirestore(firebaseApp);
  api = { authMod, fsMod, appCheck: firebaseAppCheck };
  return api;
}

function randomId(size = 20) {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(bytes, b => chars[b % chars.length]).join("");
}

function utf8Bytes(text) {
  return new TextEncoder().encode(text);
}

function utf8Text(bytes) {
  return new TextDecoder().decode(bytes);
}

function b64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromB64(text) {
  return Uint8Array.from(atob(text), c => c.charCodeAt(0));
}

async function deriveKey(password, salt) {
  let base = await crypto.subtle.importKey("raw", utf8Bytes(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJson(payload, password) {
  let salt = crypto.getRandomValues(new Uint8Array(16));
  let iv = crypto.getRandomValues(new Uint8Array(12));
  let key = await deriveKey(password, salt);
  let ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, utf8Bytes(JSON.stringify(payload)));
  return { alg: "AES-GCM", kdf: "PBKDF2-SHA256", iterations: 250000, salt: b64(salt), iv: b64(iv), ciphertext: b64(ciphertext) };
}

export async function decryptJson(box, password) {
  let salt = fromB64(box.salt);
  let iv = fromB64(box.iv);
  let key = await deriveKey(password, salt);
  let plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, fromB64(box.ciphertext));
  return JSON.parse(utf8Text(plain));
}

export async function onAuth(callback) {
  let { authMod } = await ensureFirebase();
  return authMod.onAuthStateChanged(firebaseAuth, callback);
}

export async function signInEmail(email, password) {
  let { authMod } = await ensureFirebase();
  return authMod.signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function signUpEmail(email, password) {
  let { authMod } = await ensureFirebase();
  return authMod.createUserWithEmailAndPassword(firebaseAuth, email, password);
}

export async function signInGoogle() {
  let { authMod } = await ensureFirebase();
  return authMod.signInWithPopup(firebaseAuth, new authMod.GoogleAuthProvider());
}

export async function signOut() {
  let { authMod } = await ensureFirebase();
  return authMod.signOut(firebaseAuth);
}

export async function currentUser() {
  await ensureFirebase();
  return firebaseAuth.currentUser;
}

function matchSummary(payload, extra = {}) {
  let phases = Array.isArray(extra.phases) ? extra.phases : [];
  let currentIndex = Number.isFinite(extra.currentIndex) ? extra.currentIndex : 0;
  let completed = !!extra.completed;
  return {
    team: payload?.team || "",
    opp: payload?.opp || "",
    date: payload?.date || "",
    time: payload?.time || "",
    place: payload?.place || "",
    started: payload?.started === true,
    status: payload?.status || (completed ? "completed" : payload?.started === true ? "active" : "draft"),
    completed,
    currentIndex,
    currentLabel: phases[currentIndex]?.label || (completed ? "Match terminé" : ""),
    publicId: extra.publicId || null
  };
}

export async function saveMatch(matchId, payload, clientId, extra = {}) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user) throw new Error("Connexion requise.");
  let id = matchId || randomId(18);
  let ref = fsMod.doc(firebaseDb, "users", user.uid, "matches", id);
  let summary = matchSummary(payload, extra);
  await fsMod.setDoc(ref, {
    ownerUid: user.uid,
    schemaVersion: 1,
    updatedAt: fsMod.serverTimestamp(),
    updatedAtMs: Date.now(),
    updatedByClientId: clientId || null,
    ...summary,
    payload
  });
  return id;
}

export async function listMatches() {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user) throw new Error("Connexion requise.");
  let ref = fsMod.collection(firebaseDb, "users", user.uid, "matches");
  let q = fsMod.query(ref, fsMod.orderBy("updatedAtMs", "desc"));
  let snap = await fsMod.getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function listenMatch(matchId, callback) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user) throw new Error("Connexion requise.");
  return fsMod.onSnapshot(fsMod.doc(firebaseDb, "users", user.uid, "matches", matchId), snap => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export async function deleteMatch(matchId) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user || !matchId) return;
  await fsMod.deleteDoc(fsMod.doc(firebaseDb, "users", user.uid, "matches", matchId));
}

export async function publishPublic(publicId, matchId, payload, password) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user) throw new Error("Connexion requise.");
  let id = publicId || randomId(24);
  let passwordProtected = !!String(password || "").trim();
  let publicDoc = {
    ownerUid: user.uid,
    matchId,
    schemaVersion: 1,
    updatedAt: fsMod.serverTimestamp(),
    updatedAtMs: Date.now(),
    passwordProtected
  };
  if (passwordProtected) publicDoc.encryptedPayload = await encryptJson(payload, password);
  else publicDoc.payload = payload;
  await fsMod.setDoc(fsMod.doc(firebaseDb, "publicMatches", id), publicDoc);
  return id;
}

export async function publishPublicTeam(teamPublicId, payload, password) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user) throw new Error("Connexion requise.");
  let id = teamPublicId || randomId(24);
  let ref = fsMod.doc(firebaseDb, "publicTeams", id);
  let existing = await fsMod.getDoc(ref);
  if (existing.exists() && existing.data()?.ownerUid !== user.uid) {
    throw new Error("Cet identifiant public d'équipe est déjà utilisé.");
  }
  let passwordProtected = !!String(password || "").trim();
  let publicDoc = {
    ownerUid: user.uid,
    schemaVersion: 1,
    updatedAt: fsMod.serverTimestamp(),
    updatedAtMs: Date.now(),
    passwordProtected
  };
  if (passwordProtected) publicDoc.encryptedPayload = await encryptJson(payload, password);
  else publicDoc.payload = payload;
  await fsMod.setDoc(ref, publicDoc);
  return id;
}

export async function listenPublicTeam(teamPublicId, callback) {
  let { fsMod } = await ensureFirebase();
  return fsMod.onSnapshot(fsMod.doc(firebaseDb, "publicTeams", teamPublicId), snap => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export async function deletePublicTeam(teamPublicId) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user || !teamPublicId) return;
  await fsMod.deleteDoc(fsMod.doc(firebaseDb, "publicTeams", teamPublicId));
}

export async function listenPublic(publicId, callback) {
  let { fsMod } = await ensureFirebase();
  return fsMod.onSnapshot(fsMod.doc(firebaseDb, "publicMatches", publicId), snap => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export async function deletePublic(publicId) {
  let { fsMod } = await ensureFirebase();
  let user = firebaseAuth.currentUser;
  if (!user || !publicId) return;
  await fsMod.deleteDoc(fsMod.doc(firebaseDb, "publicMatches", publicId));
}
