import { FaRegEdit } from "react-icons/fa";

// assigning elements
const form = document.getElementById("form");
const displaySection = document.getElementById("section");
const heading = document.getElementById("heading");
const bookmarkBtn = document.getElementById("addBtn");

// to toggle bookmark button innerText
let isUpdating = false;

// adding form feilds to update
const title = document.getElementById("title");
const url = document.getElementById("url");
const category = document.getElementById("category");
const tags = document.getElementById("tags");

// Function to render bookmarks from localStorage
const renderBookmarks = () => {
  // clearing styles in display section
  displaySection.innerHTML = "";
  heading.innerHTML = "";
  heading.classList.remove("background");

  isUpdating
    ? (bookmarkBtn.innerText = "Update BookMark")
    : (bookmarkBtn.innerText = "Add BookMark");

  const bookMarkArray = JSON.parse(localStorage.getItem("bookMarkArray"));

  if (!bookMarkArray || bookMarkArray.length === 0) {
    const noBookmarks = document.createElement("aside");
    noBookmarks.innerHTML = `<h2 class="text-2xl md:text-4xl text-center font-bold"> No BookMarks Added</h2>`;
    displaySection.appendChild(noBookmarks);
  } else {
    const showHeading = document.createElement("aside");
    showHeading.innerHTML = `<h2 class="text-2xl md:text-4xl text-center font-semibold"> Your BookMarks</h2>`;
    heading.classList.add("background");
    heading.appendChild(showHeading);
    // looping over the bookmarkArray
    bookMarkArray.forEach((bookmark, index) => {
      const card = document.createElement("div");
      card.classList.add("bookmark-card");
      // cards of bookmarks
      card.innerHTML = `
      <button class="absolute top-[-15px] right-[-5px] update-button text-3xl bg-yellow-500 rounded-full p-2" data-index="${index}">📝 </button>
          <h2 class="text-xl text-center font-bold ">${bookmark.title}</h2>
          <p>Link to website : <a href="${
            bookmark.url
          }" target="_blank" class="font-semibold text-md">${
        bookmark.url
      }</a></p>
          <div class="flex  gap-5 justify-between items-center">
          <h4>Category: <span class="font-semibold text-wrap">${
            bookmark.category
          }</span></h4>
          ${
            bookmark.tags.length > 1
              ? `<p>Tags: <span class="font-semibold text-wrap">${bookmark.tags}</span></p>`
              : ``
          }
          </div>
          <h5 class="text-right">Added on:  <span class="font-bold"> ${
            bookmark.createAt
          }</span></h5>
          <button class="delete-button rounded-full bg-red-500 p-3 text-white font-bold text-md hover:bg-red-400" data-index="${index}">Remove</button>
         `;

      displaySection.appendChild(card);
      //  adding event listner to delete button
      const deleteButton = card.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => deleteBookmark(index));
      //  adding event listner to update button
      const updateButton = card.querySelector(".update-button");
      updateButton.addEventListener("click", () => updateBookmark(index));
    });
  }
};

// Handling form data and saving it to localStorage
const collectingData = (event) => {
  event.preventDefault();
  isUpdating = false;
  // collecting form data
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());
  // Adding data to local storage
  dataObject.createAt = new Date().toLocaleDateString();
  // checking if there are bookmarks and assigning them
  let array = JSON.parse(localStorage.getItem("bookMarkArray")) || [];
  array.push(dataObject);
  localStorage.setItem("bookMarkArray", JSON.stringify(array));

  form.reset();
  renderBookmarks();
};

const deleteBookmark = (index) => {
  let bookMarkArray = JSON.parse(localStorage.getItem("bookMarkArray")) || [];

  bookMarkArray.splice(index, 1);
  // Update localStorage
  localStorage.setItem("bookMarkArray", JSON.stringify(bookMarkArray));
  renderBookmarks();
};

const updateBookmark = (index) => {
  isUpdating = true;
  let bookMarkArray = JSON.parse(localStorage.getItem("bookMarkArray")) || [];
  const updateBookmark = bookMarkArray.splice(index, 1);
  // Update localStorage
  localStorage.setItem("bookMarkArray", JSON.stringify(bookMarkArray));
  //  populating values in form feilds
  title.value = updateBookmark[0].title;
  url.value = updateBookmark[0].url;
  category.value = updateBookmark[0].category;
  tags.value = updateBookmark[0].tags;

  renderBookmarks();
};
//  initial rendering
renderBookmarks();
// form eventlistner
form.addEventListener("submit", collectingData);
