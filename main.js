
import Fuse from "fuse.js";
/* assigning elements */
// Adding form feilds
const form = document.getElementById("form");
const bookmarkBtn = document.getElementById("addBtn");
const displaySection = document.getElementById("section");
const heading = document.getElementById("heading");
// Delete Dialog
const deleteDialog = document.getElementById("dialogBox");
const deleteBtn = document.getElementById("deleteBtn");
const cancelBtn = document.getElementById("cancelBtn");
// update form feilds
const updateDialog = document.getElementById("updateDialogBox");
const updateForm = document.getElementById("updateForm");
const updateTitle = document.getElementById("updateTitle");
const updateUrl = document.getElementById("updateUrl");
const updateCategory = document.getElementById("updateCategory");
const updateTags = document.getElementById("updateTags");
const updateConfirmBtn = document.getElementById("updateConfirmBtn");
const updateCancelBtn = document.getElementById("updateCancelBtn");

// Search Box
const searchBox = document.getElementById('searchBox')
// varaibles to store current bookmark index
let updateIndex = null;
let deleteIndex = null;
let updateCreatedAt = null;

// Function to render bookmarks from localStorage
const renderBookmarks = (searchTerm = "") => {
  // clearing styles in display section
  displaySection.innerHTML = "";
  heading.innerHTML = "";
  searchBox.style.display = "none"
  heading.classList.remove("background");

  const bookMarkArray = JSON.parse(localStorage.getItem("bookMarkArray"));

  // No bookMarks Heading
  if (!bookMarkArray || bookMarkArray.length === 0) {
    const noBookmarks = document.createElement("aside");
    noBookmarks.innerHTML = `<h2 class="text-2xl md:text-4xl text-center font-bold"> No BookMarks Added</h2>`;
    displaySection.appendChild(noBookmarks);
  } else {
    const showHeading = document.createElement("aside");
    showHeading.innerHTML = `<h2 class="text-2xl md:text-4xl text-center font-semibold"> Your BookMarks</h2>`;
    heading.classList.add("background");
    searchBox.style.display = 'block'
    searchBox.classList.add('search')
    heading.appendChild(showHeading);
//  Searching for given title
const options = {
  keys: ["title"],
  threshold: 0.5, 
};
const fuse = new Fuse(bookMarkArray,options)
const result = searchTerm ? fuse.search(searchTerm).map(({ item }) => item) : bookMarkArray;
    // looping over the bookmarkArray
    result.forEach((bookmark, index) => {
      const card = document.createElement("div");
      card.classList.add("bookmark-card");
      // cards of bookmarks
      card.innerHTML = `
      <button class="absolute top-[-15px] right-[-5px] update-button text-3xl bg-yellow-500 rounded-full p-2 hover:scale-110 duration-300" data-index="${index}">📝 </button>
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
            bookmark.createdAt
          }</span></h5>
          <button class="delete-button rounded-full bg-red-500 p-3 text-white font-bold text-md hover:bg-red-400" data-index="${index}">Remove</button>
         `;

      displaySection.appendChild(card);
      //  adding event listner to delete button
      const deleteButton = card.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => openDeleteDialog(index));
      //  adding event listner to update button
      const updateButton = card.querySelector(".update-button");
      updateButton.addEventListener("click", () => openUpdateDialog(index));
    });
  }
};

// Handling form data and saving it to localStorage
const collectingData = (event) => {
  event.preventDefault();
  let array = JSON.parse(localStorage.getItem("bookMarkArray")) || [];
  // Collecting form data
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());
  dataObject.createdAt = new Date().toLocaleDateString();
  array.push(dataObject);
  localStorage.setItem("bookMarkArray", JSON.stringify(array));
  form.reset();
  renderBookmarks();
};
// Delete Dialog
const openDeleteDialog = (index) => {
  deleteIndex = index;
  deleteDialog.style.display = "flex";
  deleteDialog.showModal();
};
const closeDialog = () => {
  deleteDialog.style.display = "none";
  deleteDialog.close();
};

// deleting bookmark
const confirmDelete = () => {
  let bookMarkArray = JSON.parse(localStorage.getItem("bookMarkArray")) || [];
  bookMarkArray.splice(deleteIndex, 1);
  localStorage.setItem("bookMarkArray", JSON.stringify(bookMarkArray));
  renderBookmarks();
  closeDialog();
};
cancelBtn.addEventListener("click", closeDialog);
deleteBtn.addEventListener("click", confirmDelete);

// Update Dialog
const openUpdateDialog = (index) => {
  updateIndex = index;
  updateDialog.style.display = "flex";
  updateDialog.showModal();

  let bookMarkArray = JSON.parse(localStorage.getItem("bookMarkArray")) || [];
  const editBookmark = bookMarkArray[index];
  //  populating values in form feilds
  updateTitle.value = editBookmark.title;
  updateUrl.value = editBookmark.url;
  updateCategory.value = editBookmark.category;
  updateTags.value = editBookmark.tags;
  updateCreatedAt = editBookmark.createdAt;
};

const closeUpdateDialog = () => {
  updateDialog.style.display = "none";
  updateDialog.close();
};

const updateBookmark = (event) => {
  event.preventDefault();
  let array = JSON.parse(localStorage.getItem("bookMarkArray")) || [];
  // Collecting form data
  const data = new FormData(updateForm);
  const dataObject = Object.fromEntries(data.entries());
  array[updateIndex] = {
    title: dataObject.updateTitle,
    url: dataObject.updateUrl,
    category: dataObject.updateCategory,
    tags: dataObject.updateTags,
    createdAt: updateCreatedAt,
  };
  localStorage.setItem("bookMarkArray", JSON.stringify(array));
  updateForm.reset();
  closeUpdateDialog();
  renderBookmarks();
};

updateCancelBtn.addEventListener("click", closeUpdateDialog);
updateConfirmBtn.addEventListener("click", updateBookmark);
//  initial rendering
renderBookmarks();

// Searching for title
searchBox.addEventListener("input", (event) => {
  renderBookmarks(event.target.value);
});

// form eventlistner
form.addEventListener("submit", collectingData);
