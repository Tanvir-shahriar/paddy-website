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
    const res = await fetch(
      "https://openapi.programming-hero.com/api/peddy/categories"
    );
    const data = await res.json();
    displayCategories(data.categories);
  } catch (err) {
    console.error("Error loading categories:", err);
  }
};

// Display categories dynamically
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

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
      Array.from(categoryContainer.children).forEach((cat) =>
        cat.classList.remove("active-category")
      );
      categoryDiv.classList.add("active-category");

      // Load the category
      loadCategoryDynamically(category.category);
    });

    categoryContainer.appendChild(categoryDiv);
  });
};


// Load category dynamically
const loadCategoryDynamically = async (type, appendRest = false) => {
  currentCategory = type;
  const url = type
    ? `https://openapi.programming-hero.com/api/peddy/category/${type}`
    : "https://openapi.programming-hero.com/api/peddy/pets";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const cardContainer = document.getElementById("card-container");
    if (!appendRest) cardContainer.innerHTML = "";

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
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");
  document.getElementById("showAllDiv").classList.add("hidden");

  setTimeout(function () {
    document.getElementById("showAllDiv").classList.remove("hidden");
    spinner.classList.add("hidden");
    const cardContainer = document.getElementById("card-container");
    cardContainer.classList.add("grid");

    cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card", "bg-base-100", "shadow-sm", "p-2");

      cardDiv.innerHTML = `
      <figure>
        <img class="h-[200px] object-cover" src="${card.image}" alt="${
        card.pet_name
      }" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">${card.pet_name}</h2>
        ${
          !card.breed
            ? `<p>Not available</p>`
            : `<p><i class="fa-solid fa-tags"></i> ${card.breed}</p>`
        }
        ${
          !card.date_of_birth
            ? `<p>Not available</p>`
            : `<p><i class="fa-regular fa-calendar"></i> ${card.date_of_birth}</p>`
        }
        ${
          !card.gender
            ? `<p>Not available</p>`
            : `<p><i class="fa-solid fa-venus-mars"></i> ${card.gender}</p>`
        }
        ${
          !card.price
            ? `<p>Not available</p>`
            : `<p><i class="fa-solid fa-dollar-sign"></i> ${card.price}</p>`
        }
        <div class="flex gap-2">
          <button onclick="loadPhotos(${
            card.petId
          })" class="btn border-[#0E7A81]/20"><i class="fa-regular fa-thumbs-up"></i></button>
          <button id="btn-${card.petId}" class="btn text-[#0E7A81] border border-[#0E7A81]/20" onclick="loadAdopt(${card.petId})">Adopt</button>
          <button id="${
            card.petId
          }" class="btn text-[#0E7A81] border border-[#0E7A81]/20" onclick = "loadDetails('${
        card.petId
      }')">Details</button>
        </div>
      </div>
    `;
      cardContainer.appendChild(cardDiv);
    });
  }, 2000);
};

// Empty container if no cards
const emptyContainer = () => {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");

  setTimeout(function () {
    spinner.classList.add("hidden");
    const cardContainer = document.getElementById("card-container");
    cardContainer.classList.remove("grid");
    cardContainer.innerHTML = `
    <div class="text-center mx-auto my-20 flex flex-col items-center space-y-5">
      <img class="block" src="images/error.webp" alt="empty icon">
      <h1 class="text-3xl">There is no pets here</h1>
    </div>
  `;
  }, 2000);
};

// Load photos
const loadPhotos = (id) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    .then((res) => res.json())
    .then((data) => displayPhotos(data.petData));
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
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
  const showAllBtn = document.getElementById("showAll");
  showAllBtn.classList.add("hidden");

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // ✅ clear old cards before adding sorted ones
  displayCards(sorted); // display all cards
  document.getElementById("my_modal_3").close(); // close modal
};

// Load details
loadDetails = (id) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data.petData));
};
// display details
displayDetails = (data) => {
  const detailsBtn = document.getElementById("btn-details");
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
  <div class="flex flex-col items-center justify-center space-y-5">
    <img class= ""object-cover h-full w-full" src = "${data.image}" alt="pet image">
  </div> 
  <h1 class="text-xl">${data.pet_name}</h1>

  <div class="grid grid-cols-2 text-xs">
      <div class="space-y-2">
      ${
          !data.breed
            ? `<p>Breed: Not available</p>`
            : `<p><i class="fa-solid fa-tags"></i> Breed: ${data.breed}</p>`
        }
        ${
          !data.gender
            ? `<p>Gender: Not available</p>`
            : `<p><i class="fa-solid fa-venus-mars"></i> Gender: ${data.gender}</p>`
        }
        ${
          !data.vaccinated_status 
            ? `<p>vaccinated Status : Not available</p>`
            : `<p><i class="fa-solid fa-syringe"></i> vaccinated Status : ${data.vaccinated_status}</p>`
        }     
      </div>
      <div class="space-y-2">
      ${
          !data.date_of_birth
            ? `<p>Birth: Not available</p>`
            : `<p><i class="fa-regular fa-calendar"></i> Birth: ${data.date_of_birth}</p>`
        }
      ${
          !data.price
            ? `<p>Price: Not available</p>`
            : `<p><i class="fa-solid fa-dollar-sign"></i> Price: ${data.price}</p>`
        }

      </div>
  </div>
  <p class="font-semibold">Detail Information </p>
  <p class = "text-sm text-gray-600">${data.pet_details}</p>
  `;
  detailsBtn.click();
};

// adopt button functionality
loadAdopt = (id) => {
  const adoptContainer = document.getElementById('adopt-container');
  adoptContainer.innerHTML = `
    <img src="https://img.icons8.com/?size=100&id=108783&format=png&color=000000" alt="deal done">
    <h1>Congrats</h1>
    <p>Adoption process has started for your pets</p>
    <span class="countdown font-mono text-6xl" id="countdown">
      <span style="--value:3;" aria-live="polite" aria-label="3">3</span>
    </span>
  `;

  const countdownElement = document.querySelector('#countdown span');
  let value = 3;

  const interval = setInterval(() => {
    value--;
    if (value < 0) {
      clearInterval(interval);
      countdownElement.style.setProperty('--value', 0);
      countdownElement.setAttribute('aria-label', '0');
      adoptContainer.innerText = '';
      adoptContainer.innerHTML = `
      <img src = "https://img.icons8.com/?size=100&id=108641&format=png&color=000000" alt>
      <p>Adoption complete!</p>
      `;
      return;
    }

    // Update both the CSS variable and aria-label
    countdownElement.style.setProperty('--value', value);
    countdownElement.setAttribute('aria-label', value);
  }, 1000);

  const adoptBtn = document.getElementById('adopt-btn');
  if (adoptBtn) adoptBtn.click();
  const adoptUniqueBtn = document.getElementById(`btn-${id}`);
  adoptUniqueBtn.classList.add("btn-disabled","opacity-50", "cursor-not-allowed", "hover:opacity-70", "hover:bg-[#0E7A81]/10");
}

// sticky removal
window.addEventListener('scroll', function() {
  var sticky = document.getElementById('sticky');
  var footer = document.getElementById('footer');
  
  // Check if screen width is mobile (max-width of 768px)
  if (window.innerWidth <= 768) {
    // Make the sticky visible on mobile
    sticky.style.display = 'block';
    
    // Check if the sticky element has reached the footer
    var stickyRect = sticky.getBoundingClientRect();
    var footerRect = footer.getBoundingClientRect();
    
    if (stickyRect.bottom >= footerRect.top) {
      // Hide sticky element when it reaches the footer
      sticky.style.display = 'none';
    }
  } else {
    // Hide sticky element on desktop (larger than 768px)
    sticky.style.display = 'none';
  }
});




// Initial load
loadCategories();
loadCategoryDynamically(null); // load all pets initially
