const togglePassword = document.querySelectorAll(".toggle-Password");

togglePassword.forEach(element => {
  element.addEventListener('click', (event) => {
    const pass = document.querySelector(`#${element.dataset.target}`);
    if (pass.type === 'password') {
      pass.setAttribute('type', 'text');
      element.innerHTML = '<ion-icon name="eye-off-outline"></ion-icon>';
    } else {
      pass.setAttribute('type', 'password');
      element.innerHTML = '<ion-icon name="eye-outline"></ion-icon>';
    }
  });
});


setTimeout(()=>{
    const login =document.querySelector('.login');
    const workicon =document.querySelector('#workicon');
    workicon.style.display = 'none';
    login.style.display = 'block';
    if(screen.height<700){
        document.querySelector('.footer').style.display='none';
    }
}, 2000);


setTimeout(() => {
    const worknest = document.querySelector('#WorkNest');
    if (worknest) {
        worknest.click();  // Automatically submits the form after 2.5 seconds
    }
}, 2500);


function spinner(time){
    setTimeout(()=>{
        const login =document.querySelector('.login');
        const workicon =document.querySelector('#workicon');
        workicon.style.display = 'none';
        login.style.display = 'block';
        if(screen.height<700){
            document.querySelector('.footer').style.display='none';
        }
    }, time);
    
}

const tologin = document.querySelector('#tologin');
const tosignup = document.querySelector('#tosignup');

tologin.addEventListener('click', () => {
    const login = document.querySelector('.login');
    const signup = document.querySelector('.signup');
    signup.style.display = 'none';
    workicon.style.display = 'block';
    setTimeout(()=>{
        const workicon =document.querySelector('#workicon');
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
        const workicon =document.querySelector('#workicon');
        workicon.style.display = 'none';
        signup.style.display = 'block';
        login.style.display = 'none';
    
    }, 350);
     
});
document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById('googlebtn').addEventListener('click', function() {
        window.location.href = "/login";
    });
    
});
