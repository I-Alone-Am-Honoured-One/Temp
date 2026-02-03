const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const statusMessage = document.getElementById("status-message");
const panelButtons = document.querySelectorAll("[data-panel]");
const toggleButtons = document.querySelectorAll(".toggle");

const storageKey = "pulse-accounts";

const getAccounts = () => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

const saveAccounts = (accounts) => {
  localStorage.setItem(storageKey, JSON.stringify(accounts));
};

const setStatus = (message, type = "") => {
  statusMessage.textContent = message;
  statusMessage.className = "panel-status";
  if (type) {
    statusMessage.classList.add(type);
  }
};

const showPanel = (panel) => {
  if (panel === "register") {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  } else {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  }

  toggleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === panel);
  });

  setStatus("");
};

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPanel(button.dataset.panel);
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");

  const accounts = getAccounts();
  const exists = accounts.some((account) => account.email === email);

  if (exists) {
    setStatus("That email is already registered. Try logging in.", "error");
    return;
  }

  accounts.push({
    id: crypto.randomUUID(),
    name,
    email,
    password,
  });

  saveAccounts(accounts);
  registerForm.reset();
  setStatus("Account created! You can log in now.", "success");
  showPanel("login");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");

  const accounts = getAccounts();
  const account = accounts.find(
    (item) => item.email === email && item.password === password
  );

  if (!account) {
    setStatus("Incorrect email or password.", "error");
    return;
  }

  setStatus(`Welcome back, ${account.name}!`, "success");
  loginForm.reset();
});
