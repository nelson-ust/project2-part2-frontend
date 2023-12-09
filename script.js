// script.js
const apiUrl = "https://item-api-v2.onrender.com/items";

// Function to fetch items from the API and display them in the UI
async function getItems() {
  try {
    // Fetch items from the API using Axios
    const response = await axios.get(apiUrl);
    const items = response.data;
    let count = 1;
    const itemsList = document.getElementById("itemsList");

    // Generate table rows for each item and display them in the UI
    itemsList.innerHTML = items
      .map(
        (item) => `
      <tr>
        <td>${count++}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>
          <button onclick="editItem('${item._id}', '${item.name}', '${
          item.description
        }')">Edit</button>
          <button class="delete-btn" onclick="deleteItem('${
            item._id
          }')">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Function to create a new item
async function createItem() {
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");

  const name = nameInput.value;
  const description = descriptionInput.value;

  try {
    // Send a POST request to create a new item
    await axios.post(apiUrl, { name, description });
    getItems(); // Fetch and display updated items after creation

    // Clear input fields after successful creation
    nameInput.value = "";
    descriptionInput.value = "";
  } catch (error) {
    console.error("Error creating item:", error);
  }
}

// Function to initiate editing an item
async function editItem(id, name, description) {
  const modal = document.getElementById("editModal");
  const editNameInput = document.getElementById("editName");
  const editDescriptionInput = document.getElementById("editDescription");

  // Set the values of the edit modal inputs with the current item details
  editNameInput.value = name;
  editDescriptionInput.value = description;

  modal.style.display = "block"; // Display the edit modal

  // Set the item ID as a data attribute of the modal for reference during update
  modal.setAttribute("data-item-id", id);
}

// Function to close the edit modal
function closeModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}

// Function to update an item based on the values in the edit modal
async function updateItem() {
  const modal = document.getElementById("editModal");
  const itemId = modal.getAttribute("data-item-id");
  const updatedName = document.getElementById("editName").value;
  const updatedDescription = document.getElementById("editDescription").value;

  try {
    // Send a PUT request to update the item
    await axios.put(`${apiUrl}/${itemId}`, {
      name: updatedName,
      description: updatedDescription,
    });
    closeModal(); // Close the modal after updating the item
    getItems(); // Fetch and display updated items after update
  } catch (error) {
    console.error("Error updating item:", error);
  }
}

// Function to delete an item
async function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      // Send a DELETE request to remove the item
      await axios.delete(`${apiUrl}/${id}`);
      getItems(); // Fetch and display updated items after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
}

// Fetch and display items when the page is loaded
document.addEventListener("DOMContentLoaded", getItems);

// Function to handle logout
function logout() {
  // Send a GET request to logout
  fetch("https://item-api-v2.onrender.com/auth/logout", {
    method: "GET",
    credentials: "include", // Include credentials (cookies) in the request
  })
    .then(() => {
      // Logout successful, redirect to login page
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error during logout", error);
    });
}
