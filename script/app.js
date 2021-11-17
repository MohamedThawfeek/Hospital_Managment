function show() {
  let password = document.getElementById("pass");
  let eye = document.getElementById("eye");
  if (password.type === "password") {
    password.type = "text";
    eye.classList.remove("fa-eye-slash");
    eye.classList.add("fa-eye");
  } else {
    password.type = "password";
    eye.classList.remove("fa-eye");
    eye.classList.add("fa-eye-slash");
  }
}
