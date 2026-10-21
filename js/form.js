// ===== Bagian 2: Form – DOM & Event Handling =====
const form = document.getElementById("register-form");
const resultEl = document.getElementById("form-result");
const counterEl = document.getElementById("counter");
const resetBtn = document.getElementById("btn-reset");

const inputs = {
  nama: document.getElementById("nama"),
  email: document.getElementById("email"),
  usia: document.getElementById("usia"),
  minat: document.getElementById("minat"),
  motivasi: document.getElementById("motivasi"),
  setuju: document.getElementById("setuju"),
};

// Aturan validasi: mengembalikan pesan error, atau "" jika valid
const validators = {
  nama: (v) => {
    if (!v.trim()) return "Nama wajib diisi.";
    if (v.trim().length < 3) return "Nama minimal 3 karakter.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email tidak valid, contoh: nama@email.com.";
    return "";
  },
  usia: (v) => {
    if (v === "") return "Usia wajib diisi.";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 17 || n > 60) return "Usia harus berupa angka antara 17 dan 60.";
    return "";
  },
  minat: (v) => (v ? "" : "Pilih salah satu minat belajar."),
  motivasi: (v) => (v.trim().length >= 20 ? "" : "Motivasi minimal 20 karakter."),
  setuju: (checked) => (checked ? "" : "Anda harus menyetujui aturan komunitas."),
};

function getValue(name) {
  const el = inputs[name];
  return el.type === "checkbox" ? el.checked : el.value;
}

// Validasi satu field, lalu perbarui tampilan (DOM)
function validateField(name) {
  const message = validators[name](getValue(name));
  const wrapper = inputs[name].closest(".field");
  document.getElementById(`error-${name}`).textContent = message;
  wrapper.classList.toggle("invalid", message !== "");
  wrapper.classList.toggle("valid", message === "");
  return message === "";
}

// Event: input / change -> validasi langsung saat pengguna mengetik
Object.keys(inputs).forEach((name) => {
  const eventName = ["minat", "setuju"].includes(name) ? "change" : "input";
  inputs[name].addEventListener(eventName, () => validateField(name));
});

// Event: input -> penghitung karakter dinamis
inputs.motivasi.addEventListener("input", () => {
  counterEl.textContent = `${inputs.motivasi.value.length} / ${inputs.motivasi.maxLength}`;
});

// Event: submit -> validasi semua field, tampilkan hasil
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const allValid = Object.keys(inputs).map(validateField).every(Boolean);

  if (!allValid) {
    const firstInvalid = form.querySelector(".invalid input, .invalid select, .invalid textarea");
    if (firstInvalid) firstInvalid.focus();
    renderMessage("Periksa kembali data Anda. Masih ada kolom yang belum valid.", true);
    return;
  }
  renderResult({
    Nama: inputs.nama.value.trim(),
    Email: inputs.email.value.trim(),
    Usia: `${inputs.usia.value} tahun`,
    Minat: inputs.minat.value,
    Motivasi: inputs.motivasi.value.trim(),
  });
});

// Event: click -> kosongkan form
resetBtn.addEventListener("click", () => {
  form.reset();
  counterEl.textContent = `0 / ${inputs.motivasi.maxLength}`;
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
  form.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  renderMessage("Hasil pendaftaran akan tampil di sini setelah form dikirim.");
});

function renderMessage(text, isError = false) {
  resultEl.innerHTML = "";
  const p = document.createElement("p");
  p.className = "placeholder";
  p.textContent = text;
  if (isError) p.style.color = "var(--danger)";
  resultEl.appendChild(p);
}

function renderResult(data) {
  resultEl.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = `Pendaftaran berhasil, ${data.Nama.split(" ")[0]}!`;

  const list = document.createElement("dl");
  Object.entries(data).forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.append(dt, dd);
  });
  resultEl.append(title, list);
}