const containerLg = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const containerSm = document.querySelector('.container-sm');
const signupButton = document.querySelector('.signup-section header');
const loginButton = document.querySelector('.login-section header');

loginButton.addEventListener('click', () => {
    containerLg.classList.add("active");
    containerSm.classList.add('active');
});

signupButton.addEventListener('click', () => {
    containerLg.classList.remove("active");
    containerSm.classList.remove('active');
});


registerBtn.addEventListener('click', () => {
    containerLg.classList.add("active");
    containerSm.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    containerLg.classList.remove("active");
    containerSm.classList.remove('active');
});
