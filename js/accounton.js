  // SWIPER
  var swiper = new Swiper(".swiper-container", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 1,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
    },
    pagination: {
        el: ".swiper-pagination",
    },
    navigation: {
        nextEl:'.swiper-button-next',
        prevEl:'.swiper-button-prev',
    }
});

const worknesticon = document.querySelector("#worknesticon");
worknesticon.style.fontSize = '42px'; 

function toggleRotation() {
    worknesticon.classList.toggle("rotating");
}

toggleRotation();

setInterval(() => {
    worknesticon.classList.remove("rotating");
    setInterval (()=>toggleRotation(),2950)

}, 2950); 

document.addEventListener('DOMContentLoaded', (e) => {
    const home = document.querySelector('#tab1'); 
    home.checked = true;
    const login = document.querySelector('.login');
    login.style.display = 'block';
    const body = document.querySelector('body')
    body.style.backgroundColor = 'black'
   
});

document.addEventListener("DOMContentLoaded", function() {
    const nxt = document.querySelector('.confirmauth');
    if (nxt.innerHTML.trim() === 'True') {
        window.location.href = "/WorkNest_Home";
    }
});




const navlogin = document.querySelector('#navlogin');
navlogin.onclick = () => {
    const login = document.querySelector('.login');
    const body = document.querySelector('body')
    const signup = document.querySelector('.signup');
    signup.style.display = 'none';
    login.style.display = 'block';
    login.style.height = 'fit-content';
    login.style.boxShadow = '1px 1px 5px black, 0 0 10px rgba(0, 0, 0, 0.1)';
    login.style.border = '1px solid #ccc';
    login.style.backgroundColor = ' rgba(26, 36, 36, 0.676)';
    body.style.backgroundColor = 'black'
    navlogin.style.color = 'blue';
    const navsignup = document.querySelector('#navsignup');
    navsignup.style.color = 'white';
};

const navsignup = document.querySelector('#navsignup');
navsignup.onclick = () => {
    const login = document.querySelector('.login');
    const signup = document.querySelector('.signup');
    const body = document.querySelector('body')
    login.style.display = 'none';
    signup.style.display = 'block';
   
    signup.style.height = 'fit-content';
    signup.style.boxShadow = '1px 1px 5px black, 0 0 10px rgba(0, 0, 0, 0.1)';
    signup.style.border = '1px solid #ccc';
    signup.style.backgroundColor = ' rgba(26, 36, 36, 0.676)';
    body.style.backgroundColor = 'black'
    navsignup.style.color = 'blue';
    navlogin.style.color = 'white';
    };

const logclose = document.querySelectorAll('.close');

logclose.forEach(element => {
    element.onclick = () => {
        const login = document.querySelector('.login');
        const signup = document.querySelector('.signup');
        const body = document.querySelector('body');
        
        login.style.display = 'none';
        signup.style.display = 'none';
        navsignup.style.color = 'white';
        navlogin.style.color = 'white';
       body.style.backgroundColor = 'transparent'
    }
});

function spinner(time){
    setTimeout(()=>{
        const login =document.querySelector('.login');
        const workicon =document.querySelector('#workiconload');
        workicon.style.display = 'none';
        login.style.display = 'block';
        if(screen.height<700){
            //document.querySelector('.footer').style.display='none';
        }
    }, time);
    
}

const tologin = document.querySelector('#tologin');
const tosignup = document.querySelector('#tosignup');
const workicon =document.querySelector('#workiconload')

tologin.addEventListener('click', () => {
    const login = document.querySelector('.login');
    const signup = document.querySelector('.signup');
    signup.style.display = 'none';
    workicon.style.display = 'block';
    setTimeout(()=>{
        const workicon =document.querySelector('#workiconload');
        workicon.style.display = 'none';
        login.style.display = 'block';
        signup.style.display = 'none';
    
    }, 350);
    
    
    
});

tosignup.addEventListener('click', () => {
    const login = document.querySelector('.login');
    const signup = document.querySelector('.signup');
    login.style.display = 'none';
    workicon.style.display = 'block';
    setTimeout(()=>{
        const workicon =document.querySelector('#workiconload');
        workicon.style.display = 'none';
        signup.style.display = 'block';
        login.style.display = 'none';
    
    }, 350);
     
});

const togglePasswords = document.querySelectorAll('.toggle-password');

togglePasswords.forEach(togglePassword => {
  togglePassword.addEventListener('click', () => {
    const passwordField = togglePassword.previousElementSibling; // Select the previous sibling input element
    if (passwordField.type === 'password') {
      passwordField.setAttribute('type', 'text');
      togglePassword.innerHTML = '<ion-icon name="eye-off-outline"></ion-icon>';
    } else {
      passwordField.setAttribute('type', 'password');
      togglePassword.innerHTML = '<ion-icon name="eye-outline"></ion-icon>';
    }
  });
});

//END