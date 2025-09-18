console.log("Videos page is loaded");

// dynamic navbar links
const navLinks = (id) =>{
    const btn = document.getElementById(id);
    const activeBtn = document.getElementsByClassName("active-btn");
    console.log(activeBtn);
    for(let i=0; i<activeBtn.length; i++){
        activeBtn[i].classList.remove("bg-red-500", "text-white");
    }
    btn.classList.add("bg-red-500", "text-white");   
}

// categories section
const loadCategories = () =>{
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
}
// display categories
const displayCategories = categories =>{
    const categoryContainer = document.getElementById('category-container');
    categories.forEach(category => {
        console.log(category.category);
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('flex', 'border', 'border-gray-300', 'rounded-3xl', 'py-3', 'px-6', 'items-center', 'space-x-3', 'hover:bg-gray-100', 'cursor-pointer', 'text-center' );
        categoryDiv.innerHTML = `
        <img class="w-7 h-7" src="${category.category_icon}" alt="${category.category}">
        <button class="lg:text-2xl md:text-base text-base text-center">${category.category}</button>
        `;
        categoryContainer.appendChild(categoryDiv);
    });
}

loadCategories();