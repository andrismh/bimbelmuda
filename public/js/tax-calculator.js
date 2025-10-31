const $ = (id) => document.getElementById(id);

const belanjaSelect = $("belanja");
const pajakSelect = $("pajak");
const nominalValue = $("nominal").value || 0;

// Define possible pajak options for each belanja
const pajakOptions = {
  barang: [
    { value: 0.020, label: "PPh Pasal 22" },
  ],
  jasa: [
    { value: 0.015, label: "PPh Pasal 21" },
    { value: 0.025, label: "PPh Pasal 23" },
  ],
};

// Function to update pajak dropdown

function updatePajakOptions() {
  const belanjaValue = document.querySelector('input[name="belanja"]:checked')?.value || "";
  const options = pajakOptions[belanjaValue] || [];

  // Clear old options properly
  pajakSelect.innerHTML = "";

  // Add a placeholder option
  const placeholder = document.createElement("option");
  placeholder.textContent = options.length ? "Pilih pajak…" : "Pilih belanja dahulu…";
  placeholder.disabled = true;
  placeholder.selected = true;
  pajakSelect.appendChild(placeholder);

  // Add actual options
  options.forEach(opt => {
    const optionEl = document.createElement("option");
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    pajakSelect.appendChild(optionEl);
  });
}

document.getElementById("hitung").addEventListener("click", () => {
  const nominalValue = Number(document.getElementById("nominalSPJ").value) || 0;

  const dpp = nominalValue < 2_000_000 ? nominalValue : Math.floor(nominalValue * 100/111 * 100) / 100;
  document.getElementById("dpp").textContent = dpp.toLocaleString("id-ID");

  const totalPPN = nominalValue < 2_000_000 ? 0 : Math.round(dpp * 0.11);
  document.getElementById("hasilPPN").textContent =
    totalPPN.toLocaleString("id-ID");

  const ratePPh = Number(pajakSelect.value) || 0; // dropdown value is the rate
  const pajakText = pajakSelect.options[pajakSelect.selectedIndex]?.text || ""; // label like "PPh Pasal 22"

  let totalPPh;
  if (pajakText === "PPh Pasal 22" && nominalValue < 2_000_000) {
    totalPPh = 0;
  } else {
    totalPPh = Math.round(dpp * ratePPh); // <-- you forgot this assignment
  }

  document.getElementById("hasilPPh").textContent =
    (totalPPh || 0).toLocaleString("id-ID");
});

// Run once at start (in case default belanja is already selected)
updatePajakOptions();

// Run every time user changes belanja
document.querySelectorAll('input[name="belanja"]').forEach(radio => {
  radio.addEventListener("change", updatePajakOptions);
});
