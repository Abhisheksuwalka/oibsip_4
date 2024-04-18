document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const main = document.getElementById("main");

  signUpButton.addEventListener("click", () => {
    main.classList.add("right-panel-active");
  });
  signInButton.addEventListener("click", () => {
    main.classList.remove("right-panel-active");
  });
});

function hashPassword(password) {
  if (!password || password.length === 0) {
    console.log("oh we have a problem");
    throw new Error("Password cannot be empty.");
  }
  // prime numbers for hashing
  const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97,
  ];
  let hash = 15485863; // The millionth prime number according to google
  for (let i = 0; i < password.length; i++) {
    // using a combination of bitwise operations and prime numbers
    hash ^=
      (hash << 5) +
      (hash >> 2) +
      password.charCodeAt(i) * primes[i % primes.length];
  }
  // to make Sure the hash value is positive
  hash = Math.abs(hash);
  return hash.toString();
}

// array to store user information like Login Credenitals
let userDataArray = [];

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("login");

  const successMessage = document.querySelector(".successregister");

  // registration
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const userData = Object.fromEntries(formData);
    // console.log()
    const { email, newpassword } = userData;

    // what if email already exists in the database ?
    const existingUser = userDataArray.find((user) => user.email === email);
    if (existingUser) {
      alert("Email address is already taken. Please use a different email.");
      return;
    }
    const hashedPassword = hashPassword(newpassword);
    userDataArray.push({ email, newpassword: hashedPassword });
    console.log("Updated userDataArray:", userDataArray);

    // Registration successful
    successMessage.style.display = "block";
    registerForm.reset();
  });

  // Login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const userData = Object.fromEntries(formData);
    const { email, pswd } = userData;

    try {
      // Check if Data Base is empty, prompt user to sign up first
      if (userDataArray.length === 0) {
        alert(
          "There needs to be at least 1 member in the database. Please sign up first."
        );
        return;
      }
      const hashedPassword = hashPassword(pswd);
      const user = userDataArray.find((user) => user.email === email);

      if (!user) {
        alert("User not found. Please sign up first.");
        return;
      }
      if (hashedPassword === user.newpassword) {
        // Login successful
        console.log("Login Successfull");
        window.location.href = "./secured-page"; // Redirect to secured page
      } else {
        console.error("Invalid credentials");
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please check your credentials and try again.");
    }
  });
});
