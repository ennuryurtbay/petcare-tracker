const API_URL = "http://localhost:3000/pets";
let allPets = [];

function parseDate(dateValue) {
  if (!dateValue) return null;

  if (dateValue.includes("-")) {
    const parts = dateValue.split("-");

    if (parts[0].length === 4) {
      const year = parts[0];
      const day = parts[1];
      const month = parts[2];

      return new Date(`${year}-${month}-${day}`);
    }

    if (parts[0].length === 2) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }

  return new Date(dateValue);
}

function formatNextVisit(dateValue, type) {
  const date = parseDate(dateValue);

  if (!date || isNaN(date.getTime())) {
    return "Unknown";
  }

  if (type === "year") {
    date.setFullYear(date.getFullYear() + 1);
  }

  if (type === "month") {
    date.setMonth(date.getMonth() + 3);
  }

  return date.toLocaleDateString("tr-TR");
}

function getVaccineWarning(dateValue, type) {
  if (!dateValue) return "";

  const today = new Date();
  const vaccineDate = parseDate(dateValue);

  if (!vaccineDate || isNaN(vaccineDate.getTime())) {
    return "";
  }

  const nextDate = new Date(vaccineDate);

  if (type === "year") {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  if (type === "month") {
    nextDate.setMonth(nextDate.getMonth() + 3);
  }

  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `<p class="warning overdue">🚨 Vaccine overdue!</p>`;
  }

  if (type === "year" && diffDays <= 30) {
    return `<p class="warning soon">⚠️ Vaccine due soon: ${diffDays} days left</p>`;
  }

  if (type === "month" && diffDays <= 14) {
    return `<p class="warning soon">⚠️ Parasite treatment due soon: ${diffDays} days left</p>`;
  }

  return "";
}

async function fetchPets() {
  const response = await fetch(API_URL);
  allPets = await response.json();
  displayPets(allPets);
  updateStats(allPets);
}

function displayPets(pets) {
  const petList = document.getElementById("pet-list");
  petList.innerHTML = "";

  pets.forEach(pet => {
    const status = pet.vaccinationStatus || "Not specified";
    const isCompleted =
      status.toLowerCase().includes("done") ||
      status.toLowerCase().includes("completed");

    petList.innerHTML += `
      <div class="pet-card">
        <div class="pet-card-header">
          <h3>
            ${
              pet.petType.toLowerCase().includes("cat")
                ? "🐱"
                : pet.petType.toLowerCase().includes("dog")
                ? "🐶"
                : "🐾"
            } 
            ${pet.petName}
          </h3>

          <span class="${isCompleted ? "badge completed" : "badge pending"}">
            ${isCompleted ? "Completed" : "Pending"}
          </span>
        </div>

        <p><strong>Type:</strong> ${pet.petType}</p>
        <p><strong>Age:</strong> ${pet.age}</p>
        <p><strong>Owner:</strong> ${pet.ownerName}</p>
        <p><strong>Phone:</strong> ${pet.phoneNumber}</p>
        <p><strong>Vaccination:</strong> ${status}</p>

        <p><strong>Rabies Next Visit:</strong> ${formatNextVisit(pet.rabiesDate, "year")}</p>
        <p><strong>Mixed Vaccine Next Visit:</strong> ${formatNextVisit(pet.mixedDate, "year")}</p>
        <p><strong>Parasite Treatment Next Visit:</strong> ${formatNextVisit(pet.parasiteDate, "month")}</p>

        ${getVaccineWarning(pet.rabiesDate, "year")}
        ${getVaccineWarning(pet.mixedDate, "year")}
        ${getVaccineWarning(pet.parasiteDate, "month")}

        <div class="card-actions">
          <button onclick="editPet(
            ${pet.id},
            '${pet.petName}',
            '${pet.petType}',
            ${pet.age},
            '${pet.ownerName}',
            '${pet.phoneNumber}',
            '${pet.vaccinationStatus}',
            '${pet.rabiesDate}',
            '${pet.mixedDate}',
            '${pet.parasiteDate}'
          )">Edit</button>

          <button class="delete-btn" onclick="deletePet(${pet.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

function updateStats(pets) {
  const completed = pets.filter(p =>
    (p.vaccinationStatus || "").toLowerCase().includes("done") ||
    (p.vaccinationStatus || "").toLowerCase().includes("completed")
  ).length;

  document.getElementById("totalPets").textContent = pets.length;
  document.getElementById("completedPets").textContent = completed;
  document.getElementById("pendingPets").textContent = pets.length - completed;
}

function filterPets() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();

  const filteredPets = allPets.filter(pet =>
    pet.petName.toLowerCase().includes(searchValue)
  );

  displayPets(filteredPets);
}

async function addPet() {
  const petName = document.getElementById("petName").value;
  const petType = document.getElementById("petType").value;
  const age = document.getElementById("age").value;
  const ownerName = document.getElementById("ownerName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const vaccinationStatus = document.getElementById("vaccinationStatus").value;
  const rabiesDate = document.getElementById("rabiesDate").value;
  const mixedDate = document.getElementById("mixedDate").value;
  const parasiteDate = document.getElementById("parasiteDate").value;

  if (
    !petName ||
    !petType ||
    !age ||
    !ownerName ||
    !phoneNumber ||
    !vaccinationStatus ||
    !rabiesDate ||
    !mixedDate ||
    !parasiteDate
  ) {
    alert("Please fill in all fields.");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      petName,
      petType,
      age,
      ownerName,
      phoneNumber,
      vaccinationStatus,
      rabiesDate,
      mixedDate,
      parasiteDate
    })
  });

  clearForm();
  fetchPets();
}

function editPet(
  id,
  petName,
  petType,
  age,
  ownerName,
  phoneNumber,
  vaccinationStatus,
  rabiesDate,
  mixedDate,
  parasiteDate
) {
  document.getElementById("petId").value = id;
  document.getElementById("petName").value = petName;
  document.getElementById("petType").value = petType;
  document.getElementById("age").value = age;
  document.getElementById("ownerName").value = ownerName;
  document.getElementById("phoneNumber").value = phoneNumber;
  document.getElementById("vaccinationStatus").value = vaccinationStatus;
  document.getElementById("rabiesDate").value = rabiesDate;
  document.getElementById("mixedDate").value = mixedDate;
  document.getElementById("parasiteDate").value = parasiteDate;

  document.getElementById("addBtn").style.display = "none";
  document.getElementById("updateBtn").style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updatePet() {
  const id = document.getElementById("petId").value;

  const updatedPet = {
    petName: document.getElementById("petName").value,
    petType: document.getElementById("petType").value,
    age: document.getElementById("age").value,
    ownerName: document.getElementById("ownerName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    vaccinationStatus: document.getElementById("vaccinationStatus").value,
    rabiesDate: document.getElementById("rabiesDate").value,
    mixedDate: document.getElementById("mixedDate").value,
    parasiteDate: document.getElementById("parasiteDate").value
  };

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedPet)
  });

  if (!response.ok) {
    alert("Update failed!");
    return;
  }

  alert("Pet updated successfully!");

  clearForm();
  await fetchPets();

  document.getElementById("addBtn").style.display = "inline-block";
  document.getElementById("updateBtn").style.display = "none";
}

async function deletePet(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  fetchPets();
}

function clearForm() {
  document.getElementById("petId").value = "";
  document.getElementById("petName").value = "";
  document.getElementById("petType").value = "";
  document.getElementById("age").value = "";
  document.getElementById("ownerName").value = "";
  document.getElementById("phoneNumber").value = "";
  document.getElementById("vaccinationStatus").value = "";
  document.getElementById("rabiesDate").value = "";
  document.getElementById("mixedDate").value = "";
  document.getElementById("parasiteDate").value = "";
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function autoFormatDate(inputId) {
  const input = document.getElementById(inputId);

  input.addEventListener("input", function () {
    let value = input.value.replace(/\D/g, "").slice(0, 8);

    if (value.length >= 5) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }

    if (value.length >= 8) {
      value = value.slice(0, 7) + "-" + value.slice(7);
    }

    input.value = value;
  });
}

autoFormatDate("rabiesDate");
autoFormatDate("mixedDate");
autoFormatDate("parasiteDate");

fetchPets();