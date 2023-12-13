// frontend auth.js
// Function to handle API requests
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Function to check user authentication status and redirect
async function checkAuthAndRedirect() {
  try {
    const response = await fetchData("https://item-api-v2.onrender.com/auth/check-auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.authenticated) {
      // User is authenticated, redirect to index.html
      window.location.href = "index.html";
    } else if (window.location.pathname !== "/login.html") {
      // Redirect to login.html only if not already on the login page
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error(`Error checking authentication status: ${error.message}`);
    // Redirect to login.html in case of an error
    // window.location.href = "login.html";
  }
}


// Check user authentication status on page load
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await checkAuthAndRedirect();
    // You can perform other actions here if needed
    console.log("Page loaded");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});

// Event delegation for form submissions
document.addEventListener("submit", async function (event) {
  if (event.target.tagName.toLowerCase() === 'form') {
    event.preventDefault();

    const form = event.target;

    if (form.id === "registerForm") {
      // Handle registration form submission
      const username = form.querySelector("#register-username").value;
      const password = form.querySelector("#register-password").value;

      try {
        const response = await fetchData("https://item-api-v2.onrender.com/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        console.log(response.message); // Handle the response appropriately
      } catch (error) {
        console.error(`Registration failed: ${error.message}`);
      }
    }

    if (form.id === "loginForm") {
      // Handle login form submission
      const username = form.querySelector("#login-username").value;
      const password = form.querySelector("#login-password").value;

      try {
        const response = await fetchData("https://item-api-v2.onrender.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        console.log(response.message); // Handle the response appropriately

        if (response.authenticated) {
          // Redirect to index.html upon successful login
          window.location.href = "index.html";
        }

      } catch (error) {
        console.error(`Login failed: ${error.message}`);
      }
    }
  }
});

// Function to handle logout
async function logout() {
  try {
    // You can perform other logout actions here if needed
    console.log("Logout successful");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
