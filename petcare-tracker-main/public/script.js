const API_URL = "http://localhost:3000/pets";

async function fetchPets() {
  const response = await fetch(API_URL);
  const pets = await response.json();

  const petList = document.getElementById("pet-list");
  petList.innerHTML = "";

  pets.forEach(pet => {
    petList.innerHTML += `
      <div class="pet-card">
        <h3>${pet.petName}</h3>
        <p>Pet Type: ${pet.petType}</p>
        <p>Age: ${pet.age}</p>
        <p>Owner: ${pet.ownerName}</p>
        <p>Vaccination Status: ${pet.vaccinationStatus}</p>

        <button onclick="editPet(${pet.id}, '${pet.petName}', '${pet.petType}', ${pet.age}, '${pet.ownerName}', '${pet.vaccinationStatus}')">
          Edit
        </button>

        <button class="delete-btn" onclick="deletePet(${pet.id})">
          Delete
        </button>
      </div>
    `;
  });
}

async function addPet() {
  const petName = document.getElementById("petName").value;
  const petType = document.getElementById("petType").value;
  const age = document.getElementById("age").value;
  const ownerName = document.getElementById("ownerName").value;
  const vaccinationStatus = document.getElementById("vaccinationStatus").value;

  if (!petName || !petType || !age || !ownerName || !vaccinationStatus) {
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
      vaccinationStatus
    })
  });

  clearForm();
  fetchPets();
}

function editPet(id, petName, petType, age, ownerName, vaccinationStatus) {
  document.getElementById("petId").value = id;
  document.getElementById("petName").value = petName;
  document.getElementById("petType").value = petType;
  document.getElementById("age").value = age;
  document.getElementById("ownerName").value = ownerName;
  document.getElementById("vaccinationStatus").value = vaccinationStatus;

  document.getElementById("addBtn").style.display = "none";
  document.getElementById("updateBtn").style.display = "inline-block";
}

async function updatePet() {
  const id = document.getElementById("petId").value;
  const petName = document.getElementById("petName").value;
  const petType = document.getElementById("petType").value;
  const age = document.getElementById("age").value;
  const ownerName = document.getElementById("ownerName").value;
  const vaccinationStatus = document.getElementById("vaccinationStatus").value;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      petName,
      petType,
      age,
      ownerName,
      vaccinationStatus
    })
  });

  clearForm();
  fetchPets();

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
  document.getElementById("vaccinationStatus").value = "";
}

fetchPets();