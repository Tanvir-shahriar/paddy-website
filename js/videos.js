console.log("Videos page is loaded");

// Track current category and current cards for sorting
let currentCategory = null;
let currentCards = [];

// Dynamic navbar links
const navLinks = (id) => {
  const btn = document.getElementById(id);
  const activeBtn = document.getElementsByClassName("active-btn");
  for (let i = 0; i < activeBtn.length; i++) {
    activeBtn[i].classList.remove("bg-red-500", "text-white");
  }
  btn.classList.add("bg-red-500", "text-white");
};

// Load categories
const loadCategories = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
    const data = await res.json();
    displayCategories(data.categories);
  } catch (err) {
    console.error("Error loading categories:", err);
  }
};

// Display categories dynamically
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = '';

  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add(
      "flex",
      "border",
      "border-gray-300",
      "rounded-3xl",
      "py-3",
      "px-6",
      "items-center",
      "space-x-3",
      "hover:bg-gray-100",
      "cursor-pointer",
      "text-center"
    );

    categoryDiv.innerHTML = `
      <img class="w-7 h-7" src="${category.category_icon}" alt="${category.category}">
      <button class="lg:text-2xl md:text-base text-base text-center cursor-pointer">${category.category}</button>
    `;

    categoryDiv.addEventListener("click", () => {
      // Remove active class from all categories
      Array.from(categoryContainer.children).forEach(cat => cat.classList.remove("active-category"));
      categoryDiv.classList.add("active-category");

      // Load the category
      loadCategoryDynamically(category.category);
    });

    categoryContainer.appendChild(categoryDiv);
  });
};

// loading screen
loadingScreen = (info) =>{
  document.getElementById('loading-screen').classList.remove('hidden');
  document.getElementById('loading-screen').classList.add('block');
  setTimeout(function(){
    loadCategoryDynamically(info);
  }, 2000)
}

// Load category dynamically
const loadCategoryDynamically = async (type, appendRest = false) => {
  currentCategory = type;
  const url = type ? 
    `https://openapi.programming-hero.com/api/peddy/category/${type}` : 
    "https://openapi.programming-hero.com/api/peddy/pets";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const cardContainer = document.getElementById("card-container");
    if (!appendRest) cardContainer.innerHTML = '';

    const cards = data.data || data.pets || [];
    currentCards = cards; // store for sorting

    const cardsToShow = appendRest ? cards.slice(3) : cards.slice(0, 3);
    cardsToShow.length ? displayCards(cardsToShow) : emptyContainer();

    const showAllBtn = document.getElementById("showAll");
    if (!appendRest && cards.length > 3) showAllBtn.classList.remove("hidden");
    else showAllBtn.classList.add("hidden");

  } catch (err) {
    console.error("Error loading category:", err);
    emptyContainer();
  }
};

// Show remaining cards
document.getElementById("showAll")?.addEventListener("click", () => {
  document.getElementById("showAll").classList.add("hidden");
  loadCategoryDynamically(currentCategory, true);
});

// Display cards
const displayCards = (cards) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.classList.add("grid");

  cards.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "bg-base-100", "shadow-sm", "p-2");

    cardDiv.innerHTML = `
      <figure>
        <img class="h-[200px] object-cover" src="${card.image}" alt="${card.pet_name}" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">${card.pet_name}</h2>
        ${!card.breed ? `<p>Not available</p>` : `<p><i class="fa-solid fa-tags"></i> ${card.breed}</p>`}
        ${!card.date_of_birth ? `<p>Not available</p>` : `<p><i class="fa-regular fa-calendar"></i> ${card.date_of_birth}</p>`}
        ${!card.gender ? `<p>Not available</p>` : `<p><i class="fa-solid fa-venus-mars"></i> ${card.gender}</p>`}
        ${!card.price ? `<p>Not available</p>` : `<p><i class="fa-solid fa-dollar-sign"></i> ${card.price}</p>`}
        <div class="flex gap-2">
          <button onclick="loadPhotos(${card.petId})" class="btn border-[#0E7A81]/20"><i class="fa-regular fa-thumbs-up"></i></button>
          <button class="btn text-[#0E7A81] border border-[#0E7A81]/20">Adopt</button>
          <button id="${card.petId}" class="btn text-[#0E7A81] border border-[#0E7A81]/20" onclick = "loadDetails('${card.petId}')">Details</button>
        </div>
      </div>
    `;
    cardContainer.appendChild(cardDiv);
  });
};

// Empty container if no cards
const emptyContainer = () => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.classList.remove("grid");
  cardContainer.innerHTML = `
    <div class="text-center mx-auto my-20 flex flex-col items-center space-y-5">
      <img class="block" src="images/error.webp" alt="empty icon">
      <h1 class="text-3xl">There is no pets here</h1>
    </div>
  `;
};

// Load photos
const loadPhotos = (id) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    .then(res => res.json())
    .then(data => displayPhotos(data.petData));
};

const displayPhotos = (photos) => {
  const photoContainer = document.getElementById("photo-container");
  if (!Array.isArray(photos)) photos = [photos];
  photos.forEach((photo) => {
    const photoDiv = document.createElement("div");
    photoDiv.innerHTML = `<img src="${photo.image}" alt="pet image">`;
    photoContainer.appendChild(photoDiv);
  });
};

// Sort current cards by price (all loaded cards)
const sortCurrentCards = (order) => {
  if (!currentCards || currentCards.length === 0) return;

  const sorted = [...currentCards].sort((a, b) => {
    const priceA = a.price ? parseFloat(a.price) : 0;
    const priceB = b.price ? parseFloat(b.price) : 0;
    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
  const showAllBtn = document.getElementById("showAll");
  showAllBtn.classList.add("hidden");

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ''; // ✅ clear old cards before adding sorted ones
  displayCards(sorted); // display all cards
  document.getElementById("my_modal_3").close(); // close modal
};

// Load details
loadDetails = (id) =>{
 fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
 .then(res => res.json())
 .then(data => displayDetails(data.petData))
}
// display details
displayDetails = (data) =>{
   const detailsBtn = document.getElementById('btn-details');
 const detailsContainer = document.getElementById('details-container')
  detailsContainer.innerHTML= `
  <div class="flex flex-col items-center justify-center space-y-5">
  <img class= ""object-cover h-[300px]" src = "${data.image}" alt="pet image">
  <p>${data.pet_details}</p>
  </div> 
  `;
  detailsBtn.click();
}

// Initial load
loadCategories();
loadCategoryDynamically(null); // load all pets initially
