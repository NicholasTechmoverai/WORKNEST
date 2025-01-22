
document.getElementById('myuserprofile').addEventListener('change', function(event) {
  
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector("#googleprofilepic").src = e.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        document.querySelector("#googleprofilepic").src = 'nouser.png';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const userpic = document.querySelector('#profileimage');
    const userPicture = document.querySelector("#googleprofilepic");
    
    if (userPicture.src) {
        userpic.src = userPicture.src;
    }
   
});


document.getElementById('joblogo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('logohold');
    const previewImg = document.getElementById('imagePreviewImg');

    const filename = document.getElementById('logoname');


    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            filename.textContent = file.name;
        };

        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'block';
tim    }
});



// Function to show a section based on its id
function showSection(sectionId) {
    const jobhold = document.querySelector('.postajob');
    const posts = document.querySelector('.allpostedposts');
    const availjobs = document.querySelector('.alljobs');
    const chats = document.querySelector("#chat-container");
    const jobflter = document.querySelector('.jobfilter');
    const footer = document.querySelector('.dreamjob');
    const notifications = document.querySelector('.nofication-container');

    switch (sectionId) {
        case 'tab1':
            posts.style.display = 'block';
            jobhold.style.display = 'none';
            availjobs.style.display = 'none';
            chats.style.display = "none";
            footer.style.display = "block";
            jobflter.style.display = "none";
            notifications.style.display = "none";
            break;

        case 'tab2':
            updatehomejobs('all');
            availjobs.style.display = 'block';
            posts.style.display = 'none';
            jobhold.style.display = 'none';
            chats.style.display = "none";
            footer.style.display = "block";
            jobflter.style.display = "flex";
            notifications.style.display = "none";
            break;

        case 'tab3':
            jobhold.style.display = 'block';
            posts.style.display = 'none';
            availjobs.style.display = 'none';
            chats.style.display = "none";
            footer.style.display = "block";
            jobflter.style.display = "flex";
            notifications.style.display = "none";
            break;

        case 'tab4':
            notifications.style.display = "block";
            const postTimes = document.querySelectorAll('.notytime');
            postTimes.forEach(postTime => {
                const time = postTime.getAttribute('data-time');
                postTime.textContent = timeAgo(time);
            });
            jobhold.style.display = 'none';
            posts.style.display = 'none';
            availjobs.style.display = 'none';
            chats.style.display = "none";
            footer.style.display = "block";
            jobflter.style.display = "none";
          
            break;

        case 'tab5':
            chats.style.display = "block";
            posts.style.display = 'none';
            availjobs.style.display = 'none';
            jobflter.style.display = "none";
            footer.style.display = "none";
            jobhold.style.display = 'none';
            notifications.style.display = "none";
            // Scroll to the bottom
            window.scrollTo(0, document.body.scrollHeight);
            break;

        case 'tab6':
            alert('Settings radio button checked');
            break;

        default:
            posts.style.display = 'block';
            jobhold.style.display = 'none';
            availjobs.style.display = 'none';
            chats.style.display = "none";
            footer.style.display = "block";
            jobflter.style.display = "none";
            notifications.style.display = "none";
            break;
    }
}

const radioButtons = document.querySelectorAll('.topbtns input[type="radio"]');

radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
        const checkedId = this.id;
        showSection(checkedId);
        // Update the URL hash
        location.hash = checkedId;
    });
});

function loadSectionFromHash() {
    const sectionId = location.hash.substring(1);
    if (sectionId) {
        showSection(sectionId);
        // Check the corresponding radio button
        const radioButton = document.getElementById(sectionId);
        if (radioButton) {
            radioButton.checked = true;
        }
    } else {
        showSection('tab1'); // Default section
    }
}

// Load the appropriate section when the page is loaded or the hash changes
window.addEventListener('load', loadSectionFromHash);
window.addEventListener('hashchange', loadSectionFromHash);



document.getElementById('myjobinfo').addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Clear form inputs (assuming 'myjobinfo' is the form ID)
    this.reset();
});


document.getElementById('profileimage').addEventListener('click', (event) => {
    const profileinfo = document.querySelector(".userinandout");
    profileinfo.style.display = 'block';

    // Prevent the click event from propagating to the document
    event.stopPropagation();
});

document.addEventListener('click', (event) => {
    const profileinfo = document.querySelector(".userinandout");
    
    // Check if the click was outside the profileinfo element
    if (!profileinfo.contains(event.target) && event.target.id !== 'profileimage') {
        profileinfo.style.display = 'none';
    }
});


document.addEventListener('DOMContentLoaded', function () {
    showPlaceholder();
   
});


const toolbarButtons = document.querySelectorAll('.toolbar button');


toolbarButtons.forEach(button => {
    button.addEventListener('click', () => {
        const command = button.getAttribute('data-command'); 
        if (command) {
            document.execCommand(command, false, null); 
        }
        updateButtonState(button); 
    });
});


function updateButtonState(clickedButton) {
    
    toolbarButtons.forEach(button => {
        button.style.background = ''; 
    });
    
    
    clickedButton.style.background = 'black'; 
}



function hidePlaceholder() {
    var placeholder = document.getElementById('placeholder');
    placeholder.style.display = 'none';
}

function showPlaceholder() {
    var content = document.getElementById('requirementsinput').innerHTML.trim();
    var placeholder = document.getElementById('placeholder');
    if (content === '') {
        placeholder.style.display = 'block';
    } else {
        placeholder.style.display = 'none';
    }
}



function handleFileUpload(event) {
    var files = event.target.files;
    var fileList = document.getElementById('fileList');

    for (var i = 0; i < files.length; i++) {
        var fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        var fileIcon = document.createElement('span');
        fileIcon.innerHTML = '📄';
        fileItem.appendChild(fileIcon);

        var fileName = document.createElement('span');
        fileName.classList.add('file-name');
        fileName.textContent = files[i].name;
        fileItem.appendChild(fileName);

        fileList.appendChild(fileItem); 
    }
}



//codes to approve button post 
document.addEventListener("DOMContentLoaded", () => {
    const postjobconfirm = document.getElementById("confirmpost");
    postjobconfirm.addEventListener("click", handlePostJob);
});

function handlePostJob(event) {
    const confirmed = confirm("Are you sure you want to post this job?");
    if (!confirmed) {
        console.log("Posting cancelled.");
        event.preventDefault();
        return;
    }

    postajob();
    console.log("Job posted!");
}




document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('jobsContainer');
    if (!chatContainer) return; 

    // Add event listener to the parent container (assuming chatContainer is the parent)
    chatContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('buttonmoreonjob')) {
            const onmore = event.target;
            const jobcontent = onmore.closest('.foundjobs');
            const onshow = jobcontent.querySelector(".requirementshold");
            const applybtn = jobcontent.querySelector('.buttonapplyjob');

            if (onshow.style.display === "none" || onshow.style.display === "") {
                onshow.style.display = "block";
                onmore.innerHTML = 'Less <ion-icon name="chevron-up-outline"></ion-icon>';
                applybtn.style.display = "block";
            } else {
                onshow.style.display = "none";
                onmore.innerHTML = 'More <ion-icon name="chevron-down-outline"></ion-icon>';
                applybtn.style.display = 'none';
            }
        }
    });
});


 // Function to handle dropdown behavior
 function searchfor(input, list, options,holder) {
   
    input.addEventListener('focus', () => {
      list.style.display = 'block';
    });

    input.addEventListener('blur', () => {
      setTimeout(() => list.style.display = 'none', 200);
    });

    // Filter the dropdown list based on input
    function filterFunction() {
      const filter = input.value.toUpperCase();
      for (let i = 0; i < options.length; i++) {
        const text = options[i].textContent || options[i].innerText;
        options[i].style.display = text.toUpperCase().includes(filter) ? '' : 'none';
      }
    }

    input.addEventListener('keyup', filterFunction);

  
    Array.from(options).forEach(option => {
      option.addEventListener('click', () => {
       
        const langlisthold = document.createElement('div');
        const newText = option.innerHTML|| option.textContent || option.innerText;

        if (!Array.from(holder.children).some(child => child.innerHTML === newText)) {
            langlisthold.innerHTML = newText;
            langlisthold.classList.add('editmediv')
            input.value = ""; 
            list.style.display = 'none'; 
            holder.prepend(langlisthold);
        }

       
      });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const newText = input.value;
          if (newText && !Array.from(holder.children).some(child => child.innerHTML === newText)) {
            const langlisthold = document.createElement('div');
            langlisthold.innerHTML = newText;
            langlisthold.classList.add('editmediv')
            holder.prepend(langlisthold);
            input.value = null;
            list.style.display = 'none';
          }
        }
        input.addEventListener('keyup', (event) => {
            if (event.key !== 'Enter') {
                list.style.display = 'block';
            }
        })
      });
  }


  const input1 = document.getElementById('languageInput');
  const list1 = document.getElementById('languageList');
  const options1 = list1.getElementsByTagName('div');
  const langhold = document.getElementById('languagehold');
  searchfor(input1, list1, options1,langhold);

 
  const input2 = document.getElementById('IntrestInput');
  const intrestlist = document.getElementById('intrestList');
  const option2 = intrestlist.getElementsByTagName('div');
  const intresthold = document.getElementById('intrestshold');
  searchfor(input2, intrestlist,option2,intresthold);


  const input3 = document.getElementById('skillsInput');
  const skillslist = document.getElementById('skillsList');
  const option3 = skillslist.getElementsByTagName('div');
  const skillshold = document.getElementById('skillshold');
  searchfor(input3, skillslist,option3,skillshold);

  document.addEventListener('DOMContentLoaded', () => {
    const uemail = document.getElementById('myuseremail');
    const usermname = document.getElementById('myusername');
    const code = document.getElementById('countrycode');
    const phoneno = document.getElementById('userphone');
    const dob = document.getElementById('userdob');
    const gender = document.getElementsByName('gender');

    function checkForm() {
        let isChecked = false;

        for (let i = 0; i < gender.length; i++) {
            if (gender[i].checked) {
                isChecked = true;
                break;
            }
        }

     
        if (!isChecked || uemail.value === "" || usermname.value === "" || code.value === "" || dob.value === "" || phoneno.value === "") {
            const input1 = document.querySelector('.info-input-form');
            const input2 = document.querySelector('.info-input-formnext');
            input1.style.display = 'block';
            const odd = document.querySelector('#blurme');
            odd.style.filter = 'blur(5px)';
            odd.style.pointerEvents = 'none';
        }
    }
    

    setTimeout(()=>{
        checkForm();
    },120000)


    const clozz = document.querySelectorAll('.infoclose');
    clozz.forEach(close => {
        const input1 = document.querySelector('.info-input-form');
        const input2 = document.querySelector('.info-input-formnext');
        const inputlast = document.querySelector('.info-input-formlast');
        close.addEventListener('click', () => {
            let isChecked = false;

            for (let i = 0; i < gender.length; i++) {
                if (gender[i].checked) {
                    isChecked = true;
                    break;
                }
            }

            if (!isChecked || uemail.value === "" || usermname.value === "" || code.value === "" || dob.value === "" || phoneno.value === "") {
                const info = document.getElementById('pernalrem');
                const backinfo = document.getElementById('backgrem');
                info.textContent = "Complete updating your profile info to proceed!";
                backinfo.textContent = "Complete updating your personal info to close!"
                backinfo.style.color = "red"
                info.style.color = "red";
                input1.style.display = 'block';
                input2.style.display = 'none';
                inputlast.style.display = "none";

                if(usermname.value === ""){
                    usermname.classList.add('warning')
                    usermname.addEventListener('keyup',()=>{
                        if(usermname.value !== ""){
                            usermname.classList.remove('warning');
                        }
                    })
                }

                if(code.value === ""){
                    code.classList.add('warning')
                    code.addEventListener('keyup',()=>{
                        if(code.value !== ""){
                            code.classList.remove('warning');
                        }
                    })
                }

                if(phoneno.value === ""){
                    phoneno.classList.add('warning')
                    phoneno.addEventListener('keyup',()=>{
                        if(phoneno.value !== ""){
                           phoneno.classList.remove('warning');
                        }
                    })
                }
                
                if(dob.value === "" ){
                    dob.classList.add('warning')
                   dob.addEventListener('keyup',()=>{
                        if(dob.value !== ""){
                            dob.classList.remove('warning');
                        }
                    })
                }
                const a = document.getElementById('ongenders');
                const gen = document.getElementsByName('gender');
                
                function updateColor() {
                    const isChecked = Array.from(gen).some(radio => radio.checked);
                    
                    if (!isChecked) {
                        a.style.color = "red";
                    } else {
                        a.style.color = "";
                    }
                }
        
                updateColor();
                
                gen.forEach(s => {
                    s.addEventListener('click', updateColor);
                });
                
                
                
                setTimeout(() => {
                    info.textContent = "Kindly, update your details to proceed, ";
                    backinfo.textContent = "Kindly, Finish updating your details to proceed,";
                    backinfo.style.color = "";
                    info.style.color = ""; 
                }, 5000);
            }else{
                input1.style.display = 'none';
                input2.style.display = 'none';
                const odd = document.querySelector('#blurme');
                odd.style.filter = 'blur(0px)';
                odd.style.pointerEvents = '';
            }
        });
    });
});


  document.getElementById('istnext').addEventListener('click', () => {
    const input1 = document.querySelector('.info-input-form');
    const input2 = document.querySelector('.info-input-formnext');
  
    input1.style.display = 'none';
    input2.style.display = 'block';
  
    const odd = document.querySelector('#blurme');
    odd.style.filter = 'blur(5px)';
    odd.style.pointerEvents = 'none';

  });

document.getElementById('ndback').addEventListener("click",()=>{
    const input1 = document.querySelector('.info-input-form');
    const input2 = document.querySelector('.info-input-formnext');
  
    input1.style.display = 'block';
    input2.style.display = 'none';
  
    const odd = document.querySelector('#blurme');
    odd.style.filter = 'blur(5px)';
    odd.style.pointerEvents = 'none';

})
document.getElementById('ndnext').addEventListener('click', () => {
    const inputlast = document.querySelector('.info-input-formlast');
    const input2 = document.querySelector('.info-input-formnext');
  
    inputlast.style.display = 'block';
    input2.style.display = 'none';
  
    const odd = document.querySelector('#blurme');
    odd.style.filter = 'blur(5px)';
    odd.style.pointerEvents = 'none';

  });

document.getElementById('ndfinishback').addEventListener('click', () => {
    const inputlast = document.querySelector('.info-input-formlast');
    const input2 = document.querySelector('.info-input-formnext');
  
    inputlast.style.display = 'none';
    input2.style.display = 'block';
  
    const odd = document.querySelector('#blurme');
    odd.style.filter = 'blur(5px)';
    odd.style.pointerEvents = 'none';

  });

  document.addEventListener('input', function (event) {
    if (event.target.classList.contains('autoExpand')) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    }
});


document.getElementById('editprofileelipsis').addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from bubbling up
    const more = document.querySelector('.ellipsisdescription');
    if (more.style.display === "none" || more.style.display === "") {
        more.style.display = "block";
    } else {
        more.style.display = "none";
    }
});

document.addEventListener('click', (event) => {
    const more = document.querySelector('.ellipsisdescription');
    const isClickInside = document.getElementById('editprofileelipsis').contains(event.target);
    if (!isClickInside) {
        more.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById('menutoogled');
    
    if (toggle && screen.width <= 950) {
        toggle.style.position = "fixed";
    }

    document.getElementById('taball').checked = true
   
    document.getElementById("letmeeditprofile").addEventListener('click',()=>{
        document.querySelector(".info-input-form").style.display = "block"
    });
});
document.getElementById('closeprofile').addEventListener('click',()=>{
    document.querySelector(".userinandout").style.display = "none";
});

document.getElementById('menutoogled').addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from bubbling up
    const more = document.querySelector('.topbtns');
    if (more.style.display === "none" || more.style.display === "") {
        more.style.display = "block";
    } else {
        more.style.display = "none";
    }
});

document.addEventListener('click', (event) => {
    const more = document.querySelector('.topbtns');
    const isClickInside = document.getElementById('menutoogled').contains(event.target);
    if (!isClickInside) {
     more.style.display = "none";
    }
});


document.getElementById('mynewpost').addEventListener("click", () => {
    const inputDiv = document.querySelector('.mynewoistinput');
    inputDiv.classList.toggle('expanded');
});













// my  upload swiper 
let currentSlide = 0;
let startX = 0;

document.getElementById('fileUpload').addEventListener('change', function(event) {
    const slidesContainer = document.getElementById('slidesContainer');
    const bulletsContainer = document.getElementById('bulletsContainer');
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            let mediaElement;
            if (file.type.startsWith('image/')) {
                mediaElement = document.createElement('img');
            } else if (file.type.startsWith('video/')) {
                mediaElement = document.createElement('video');
                mediaElement.controls = true;
            }
            mediaElement.src = e.target.result;
            if (slidesContainer.children.length === 0) mediaElement.classList.add('active');
            
            // Create media container and style it
            const mediaContainer = document.createElement('div');
            mediaContainer.style.position = 'relative'; // Positioning relative to contain the absolute button
            mediaContainer.style.display = 'inline-block'; // Keep images inline
            mediaContainer.appendChild(mediaElement);

            // Create and style delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete_btn')
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '✖';
            deleteBtn.style.position = 'absolute';
            deleteBtn.style.top = '10px';
            deleteBtn.style.right = '10px';
            deleteBtn.style.background = 'red';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.padding = '5px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.borderRadius = '50%';

            deleteBtn.addEventListener('click', function() {
                slidesContainer.removeChild(mediaContainer); // Remove the media container
                bulletsContainer.removeChild(bullet); // Remove the associated bullet
            });
            
            mediaContainer.appendChild(deleteBtn);
            slidesContainer.appendChild(mediaContainer);
            
            const bullet = document.createElement('span');
            if (slidesContainer.children.length === 1) bullet.classList.add('active');
            bullet.addEventListener('click', function() {
                changeSlideTo(Array.from(bulletsContainer.children).indexOf(bullet));
            });
            bulletsContainer.appendChild(bullet);
        };
        
        reader.readAsDataURL(file);
    }
});


const slider = document.getElementById('slider');

slider.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
});

slider.addEventListener('touchend', function(e) {
    const endX = e.changedTouches[0].clientX;
    if (startX > endX + 50) {
        changeSlide(1);
    } else if (startX < endX - 50) {
        changeSlide(-1);
    }
});

slider.addEventListener('mousedown', function(e) {
    startX = e.clientX;
    slider.style.cursor = 'grabbing';
});

slider.addEventListener('mouseup', function(e) {
    const endX = e.clientX;
    slider.style.cursor = 'grab';
    if (startX > endX + 50) {
        changeSlide(1);
    } else if (startX < endX - 50) {
        changeSlide(-1);
    }
});

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slides img, .slides video');
    const bullets = document.querySelectorAll('.bullets span');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    bullets[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    bullets[currentSlide].classList.add('active');
}

function changeSlideTo(index) {
    const slides = document.querySelectorAll('.slides img, .slides video');
    const bullets = document.querySelectorAll('.bullets span');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    bullets[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    bullets[currentSlide].classList.add('active');
}


document.querySelector('#closethepost').addEventListener("click", () => {
   const va =  document.querySelector(".mynewoistinput")
    va.classList.toggle('expanded');
    document.getElementById('post-content').value = '';
    document.querySelector(".slides").innerHTML = ""; 
    document.querySelector("#fileUpload").value = "";
});




function updatePostTimes() {
    const postTimes = document.querySelectorAll('.post-time');
    postTimes.forEach(postTime => {
        const time = postTime.getAttribute('data-time');
        postTime.textContent = timeAgo(time);
    });
}

setInterval(updatePostTimes, 60000); 
function timeAgo(time) {
    const now = new Date();
    const postTime = new Date(time);
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    let interval = Math.floor(diffInSeconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(diffInSeconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(diffInSeconds / 86400);
    if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(diffInSeconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(diffInSeconds / 60);
    if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";

    return "just now";
}

function check_if_liked(alllikesid,post){
    const id = document.querySelector("#myprroom").textContent.trim();
    alllikesid.forEach(likeid=>{
        if (likeid === id){
            post.classList.add('postliked')
        }
    })

}


function updatehomejobs(type) {
    fetch('/fetchjobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Fetched jobs successfully');

            // Clear existing job entries before adding new ones
            const jobsContainer = document.getElementById('jobsContainer');
            jobsContainer.innerHTML = '';

            data.jobs.forEach(job => {
                const jobposter = job.jobposter;
                const jobposteremail = job.jobposteremail;
                const jobposterprofilepic = job.jobposterprofilepic;
                const jobcompany = job.jobcompany;
                const joblink = job.joblink;
                const joblogo = job.joblogo;
                const jobposition = job.jobposition;
                const jobcategory = job.jobcategory;
                const jobdescription = job.jobdescription;
                const jobexpiry = job.jobexpiry;
                const jobcountry = job.jobcountry;
                const jobcity = job.jobcity;
                const jobRequirement = job.jobrequirement;
                const requirementattach = job.requirementattach;
                const jobtypes = job.jobtypes;
                const jobexperience = job.jobexperience;
                const minSalary = job.minsalary;
                const maxSalary = job.maxsalary;

                const jobEntry = document.createElement('div');
                jobEntry.classList.add('foundjobs');

                jobEntry.innerHTML = `
                    <div class="itsborder">
                        <img id="availjoblogo" src="${joblogo}" alt="logo">
                        
                        <div class="jobcontentitsnow">
                            <div class="posternamehold">
                                <div id="postername">${jobposter}</div>
                                <div id="position">${jobposition}</div>
                                <button type="button" class="postsave" title="Save this job"><ion-icon name="download-outline"></ion-icon></button>
                            </div>
                            <div id="joblink"><a href="${joblink}">${jobcompany}</a></div>
                            <div class="jobcategory">${jobcategory}</div>
                            <div class="jobdescription">${jobdescription}</div>
                            <div class="joblocation"><a href="#">${jobcity}, ${jobcountry}</a></div>
                            <div class="requirementshold">
                                <div class="topdesc">
                                    <p>Job requirements:</p>
                                    <div class="jobtype">Type:<span>${jobtypes}</span></div>
                                </div>
                                <div class="allrequirements">
                                    ${jobRequirement}
                                </div>
                                <div class="downhold">
                                    <div class="jobexper">Experience:<span>${jobexperience}</span></div>
                                    <div class="jobsalaryrange">Salary:<span id="jobsalary">${minSalary} - ${maxSalary}</span><span id="currency">Ksh</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="timeinfo">
                        <div id="posttime">today</div>
                        <div class="postby">By: <span id="jobexpiry">${jobexpiry}</span></div>
                    </div>
                    <div class="holdthisbtns">
                        <button class="buttonmoreonjob">More <ion-icon name="chevron-down-outline"></ion-icon></button>
                        <button class="buttonapplyjob" type="button">Apply <ion-icon name="push-outline"></ion-icon></button>
                    </div>
                `;

                // Append the created job entry to your jobs container
                jobsContainer.appendChild(jobEntry);
            });
        } else {
            console.error('Failed to update jobs:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentOffset += chunkSize;
      
    }
});


function fetchnotifications(state, userid) {
    console.log("workiing!!")
    fetch('/fetchnotifications', { // Corrected endpoint URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: state, userid: userid })
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) { // Check if there are notifications
            data.forEach(notification => {
                const username = notification.username;
                const profile = notification.profile_pic;
                const type = notification.type;
                const time = notification.time;
                const state = notification.state;
                const notyid = notification.notyid;
                const postid = notification.postid;
    
                console.log("✅state:",state)
                shownotifications(username, profile, type, time, postid, notyid, state);
            });
        } else {
            console.log('No notifications found.');
        }
    })
    .catch(error => console.error('Error:'));
 
}






function updatenotifications(notyid,mypostid,userid){
 
    fetch('/update/noty', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postid: mypostid, userid: userid, notyid: notyid })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const post = data.open_post[0];  // Assuming open_post is an array and you need the first item
            const postid = post.postid;
            const userid = post.userid;
            const time = post.time;
            const postcontent = post.postcontent;
            const postfiles = post.postfiles;

            console.log(`👌👌👌Post status updated successfully: Post ID: ${postid}, User ID: ${userid}, Time: ${time}, Content: ${postcontent}, Files: ${postfiles}`);
        } else {
            console.error('Failed to update post status:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

