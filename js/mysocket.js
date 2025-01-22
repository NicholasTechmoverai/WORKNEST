const socket = io();

// Function to gather form data and submit it to the backend
function postajob() {
    function getElementValue(selector, isInput = true) {
        const element = document.querySelector(selector);
        if (element) {
            return isInput ? (element.value || '').trim() : (element.textContent || '').trim();
        }
        return '';
    }

    const jobCompany = getElementValue('#jobcompany');
    const jobLink = getElementValue('#joblink');
    const jobPosition = getElementValue('#jobprofile');
    const jobCategory = getElementValue('#jobcat');
    const jobDescription = getElementValue('#jobdescription');
    const jobRequirement = document.querySelector('#requirementsinput').innerHTML;
    const jobExpiry = getElementValue('#jobexpiry');
    const minSalary = getElementValue('#minsalary');
    const maxSalary = getElementValue('#maxsalary');
    const country = getElementValue('#countyinlocation');
    const city = getElementValue('#cityinlocation');

    // For file list items
    const jobRequirementFiles = document.querySelectorAll('#fileList .file-item');
    const fileContents = Array.from(jobRequirementFiles).map(file => file.textContent.trim());

    // For job type checkboxes
    const selectedJobTypes = [];
    if (document.getElementById('jobtype_fulltime').checked) {
        selectedJobTypes.push('fulltime');
    }
    if (document.getElementById('jobtype_parttime').checked) {
        selectedJobTypes.push('parttime');
    }
    if (document.getElementById('jobtype_online').checked) {
        selectedJobTypes.push('online');
    }
    if (document.getElementById('jobtype_contract').checked) {
        selectedJobTypes.push('contract');
    }

    // For experience level checkboxes
    const selectedExperienceLevels = [];
    if (document.getElementById('experience_entry').checked) {
        selectedExperienceLevels.push('entry');
    }
    if (document.getElementById('experience_mid').checked) {
        selectedExperienceLevels.push('mid');
    }
    if (document.getElementById('experience_senior').checked) {
        selectedExperienceLevels.push('senior');
    }
    if (document.getElementById('experience_expert').checked) {
        selectedExperienceLevels.push('expert');
    }

    const username = getElementValue('#username', false);
    const useremail = getElementValue('#usermyemail', false);
    const userprofilepic = document.querySelector("#googleprofilepic").src;

    var fileInput = document.querySelector('#joblogo');
    var file = fileInput.files[0]; // Get the selected file object


    if (file) {
        const formData = new FormData();
        formData.append('jobLogo', file); // Append the selected file to FormData

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const filePath = data.filePath;

                const jobData = {
                    username,
                    useremail,
                    userprofilepic,
                    jobCompany,
                    jobLink,
                    jobPosition,
                    jobCategory,
                    jobDescription,
                    jobRequirement,
                    jobExpiry,
                    minSalary,
                    maxSalary,
                    country,
                    city,
                    fileContents,
                    jobTypes: selectedJobTypes,
                    experienceLevels: selectedExperienceLevels
                };

                console.log(jobData);
                console.log(file);

                // Assuming socket is already defined and initialized
                socket.emit('jobpost', { jobdata: jobData, jobLogo: filePath });
            } 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('No file selected');
    }
}



socket.on('updatingjob', function(data) {
    /* if (document.getElementById(`job-${data.uniqueId}`)) {
         // Job already exists, skip adding
       return;
     }*/
    
         var jobposter = data.jobposter;
         var jobposteremail = data.jobposteremail;
         var jobposterprofilepic = data.jobposterprofilepic;
         var jobcompany = data.jobcompany;
         var joblink = data.joblink;
         var joblogo = data.joblogo;
         var jobposition = data.jobposition;
         var jobcategory = data.jobcategory;
         var jobdescription = data.jobdescription;
         var jobexpiry = data.jobexpiry;
         var jobcountry = data.jobcountry;
         var jobcity = data.jobcity;
         var jobRequirement = data.jobrequirement;
         var requirementattach = data.requirementattach;
         var jobtypes = data.jobtypes;
         var jobexperience = data.jobexperience;
         var minSalary = data.minsalary;
         var maxSalary = data.maxsalary;
         
     
      
     
         var jobEntry = document.createElement('div');
         //jobEntry.id = `job-${data.uniqueId}`;
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
         document.getElementById('jobsContainer').appendChild(jobEntry);
       
           
 });

const countydisp = document.querySelector("#countyinlocation");
const citydisp = document.querySelector("#countyInput");

// Request countries from the server
function requestCountries(a,b) {
    const prvatroomElement = document.getElementById('myprroom');
    if (prvatroomElement) {
        const prvatroom = prvatroomElement.textContent.trim();
        socket.emit('getCountry', {'prvtroom': prvatroom});
    } else {
        console.error('Element with ID "myprroom" not found.');
    }
  listthem(a,b)
  
}

function listthem(citydisp,countydisp){
    socket.on('getCounties', (data) => {
        countydisp.innerHTML = '';
      
        data.countries.forEach(country => {
          var option = document.createElement('div');
          option.innerHTML = country.name;
          countydisp.appendChild(option);
        });
      
        const options = countydisp.getElementsByTagName('div');
        searchin(citydisp, countydisp, options);
      });
}



function searchin(input, list, options) {
  input.addEventListener('focus', () => {
    list.style.display = 'block';
  });

  input.addEventListener('blur', () => {
    setTimeout(() => list.style.display = 'none', 200);
  });

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
      input.value = option.textContent || option.innerText;
      list.style.display = 'none';
    });
  });
}


// Event listener for change event on county select element
countydisp.addEventListener('change', () => {
    const selectedCountry = countydisp.value.trim();
    if (selectedCountry) {
        // Emit 'getcounty' event to fetch cities for the selected country
        socket.emit('getcounty', { country: selectedCountry });
    }
});

// Listener to update the city select element with received cities
socket.on('counties', (data) => {
    // Clear existing options except the default one
    citydisp.innerHTML = '<option value="">Select City</option>';

    // Add options for each city received
    data.cities.forEach(city => {
        var option = document.createElement('option');
        option.value = city.name;
        option.innerHTML = city.name;
        citydisp.appendChild(option);
    });
});


document.getElementById('tab3').addEventListener('click', () => {
    requestCountries(citydisp,countydisp);
});

document.getElementById('countyInput').addEventListener('focus', () => {
    requestCountries(citydisp,countydisp);
});

document.getElementById('countyInput').addEventListener('blur', () => {
    setTimeout(() => {
        countydisp.innerHTML = '';
    }, 60000); // 1 minute delay
});



//countru search two, 
const countrydisp = document.querySelector("#countryin");
const citrydisp = document.querySelector("#contryinput");
document.getElementById('istnext').addEventListener('click', () => {
    requestCountries(citrydisp,countrydisp)
});

document.getElementById('countyInput').addEventListener('focus', () => {
    requestCountries(citrydisp,countrydisp)
});

document.getElementById('contryinput').addEventListener('blur', () => {
    setTimeout(() => {
        countrydisp.innerHTML = '';
    }, 60000); // 1 minute delay
});



document.getElementById('ndnfinish').addEventListener('click', async () => {
    async function collectformoneinput() {
        const userEmail = document.getElementById('usermyemail').textContent.trim();
        const userImage = document.getElementById('myuserprofile'); // Ensure this is an input element with type="file"
        const userPhone = document.getElementById('userphone').value;
        const dob = document.getElementById('userdob').value;

        let filePath = '';
        
        if (userImage.files && userImage.files[0]) {
            const file = userImage.files[0];
            const formData = new FormData();
            formData.append('jobLogo', file);
        
            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    filePath = data.filePath;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        let selectedGender;
        const genderRadios = document.getElementsByName('gender');
        genderRadios.forEach(gen => {
            if (gen.checked) {
                selectedGender = gen.value;
            }
        });

        const languageDivs = document.querySelectorAll('#languagehold div');
        const selectedLanguages = Array.from(languageDivs).map(div => div.textContent.trim());

        return {
            filePath,
            userPhone,
            userEmail,
            dob,
            selectedGender,
            selectedLanguages
        };
    }

    const formData = await collectformoneinput();
    console.log("formone:")
    console.log(formData);


    function collectFormTwoInput() {
        const myCountry = document.getElementById('contryinput').value;
        const city = document.getElementById('mycity').value;

        const interests = document.querySelectorAll('#intrestshold div');
        const myInterests = Array.from(interests).map(div => div.textContent.trim());

        const skills = document.querySelectorAll('#skillshold div span');
        const mySkills = Array.from(skills).map(span => span.textContent.trim());

        const myLinkedIn = document.getElementById('linkedin').value;
        const myWhatsApp = document.getElementById('whatsapp').value;
        const myFacebook = document.getElementById('facebook').value;
        const myTikTok = document.getElementById('tiktok').value;

        return {
            myCountry,
            city,
            myInterests,
            mySkills,
            myLinkedIn,
            myWhatsApp,
            myFacebook,
            myTikTok
        };
    }

    function collectLastFormInput() {
        const institutions = document.querySelectorAll('.instclone');
        const institutionData = Array.from(institutions).map(institution => ({
            university: institution.querySelector('.UniversityInput').value,
            from: institution.querySelector('.frominstitutionStart').value,
            to: institution.querySelector('.frominstitutionEnd').value,
            achievements: institution.querySelector('.institutionachieve').value
        }));

        const organisations = document.querySelectorAll('.experienceloop');
        const organisationData = Array.from(organisations).map(organisation => ({
            organization: organisation.querySelector('.organizationInput').value,
            from: organisation.querySelector('.fromDate').value,
            to: organisation.querySelector('.toDate').value,
            position: organisation.querySelector('.positiondescript').value
        }));

        const projects = document.querySelectorAll('.cloneproject');
        const projectsData = Array.from(projects).map(project => ({
            projectName: project.querySelector('.projectName').value,
            description: project.querySelector('.projectdscript').value
        }));

        return {
            institutionData,
            organisationData,
            projectsData
        };
    }

    const inputLast = document.querySelector('.info-input-formlast');
    inputLast.style.display = 'none';
    const odd = document.querySelector('#blurme');
    odd.style.filter = 'blur(0px)';
    odd.style.pointerEvents = '';

    const formOneData = await collectformoneinput();
    const formTwoData = collectFormTwoInput();
    const lastFormData = collectLastFormInput();

    console.log('Form One Data:', formOneData);
    console.log('Form Two Data:', formTwoData);
    console.log('Last Form Data:', lastFormData);

    socket.emit('updatemydetails', {
        formone: formOneData,
        formtwo: formTwoData,
        lastform: lastFormData
    });
});



document.addEventListener('DOMContentLoaded', function() {
    function joinRoom(username, prvtroom, useremail) {
        socket.on('connect', () => {
            socket.emit('joinworknest', { username: username, prvtroom: prvtroom, useremail: useremail });

            socket.on('roomJoined', (data) => {
                if (data && data.mystate) {
                    document.getElementById('state').innerHTML = data.mystate;
                    console.log('Connection State:', data.mystate);
                    console.log('Current Room:', data.room);
                    console.log('Connected Users:', data.users);
                } else {
                    console.error('Invalid data received from server:', data);
                }
            });

            socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });

            socket.on('worknestin', (data) => {
                document.getElementById('userphone').value = data.phone || '';
                document.getElementById('userdob').value = data.dob || '';
                document.getElementsByName('gender').forEach(g => {
                    g.checked = (g.value === data.gender);
                });
            });
        });
    }

    const prvatroomElement = document.getElementById('myprroom');
    const usernameElement = document.querySelector('#username');
    const userEmailElement = document.getElementById('usermyemail');

    if (prvatroomElement && usernameElement && userEmailElement) {
        const prvatroom = prvatroomElement.textContent.trim();
        const username = usernameElement.textContent.trim();
        const userEmail = userEmailElement.textContent.trim();
        joinRoom(username, prvatroom, userEmail);
        fetchnotifications('unread', prvatroom)
        fetchnotifications('read', prvatroom)
    } else {
        console.error('Required elements not found.');
    }
});


document.getElementById('addinstitution').addEventListener('click', () => {
    const newInstitution = document.querySelector('.instclone').cloneNode(true);
    newInstitution.querySelectorAll('input, textarea').forEach(input => {
        input.value = "";
    });
    document.querySelector('.institutionadder').appendChild(newInstitution);
});
document.getElementById('addexperience').addEventListener('click', () => {
    const newInstitution = document.querySelector('.experienceloop').cloneNode(true);
    newInstitution.querySelectorAll('input, textarea').forEach(input => {
        input.value = "";
    });
    document.querySelector('.experienceadder').appendChild(newInstitution);
});

document.getElementById('addproject').addEventListener('click', () => {
    const newInstitution = document.querySelector('.cloneproject').cloneNode(true);
    newInstitution.querySelectorAll('input, textarea').forEach(input => {
        input.value = "";
    });
    document.querySelector('.personalprojectsholder').appendChild(newInstitution);
});

document.getElementById('search').addEventListener('input', function() {
    const query = this.value;

    socket.send(query);
  });


//post a post>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
document.querySelector('#submitmypost').addEventListener('click', () => {
    const filesInPost = document.getElementById('fileUpload');
    const postInfo = document.querySelector("#post-content").value;
    const userEmail = document.querySelector('#usermyemail').textContent;

    console.log('Post Info:', postInfo);
    console.log('User Email:', userEmail);

    const files = filesInPost.files;
    const filePaths = [];

    if (files.length > 0) {
        const uploadPromises = Array.from(files).map(file => {
            console.log('Uploading file:', file.name);
            const formData = new FormData();
            formData.append('jobLogo', file);

            return fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    filePaths.push(data.filePath);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });

        Promise.all(uploadPromises).then(() => {
            const jobData = {
                useremail: userEmail,
                postinfo: postInfo,
                files: filePaths,
            };

            socket.emit('thispost', { jobdata: jobData });
            console.log('Job Data:', jobData);

            // Clear the data
            document.querySelector("#post-content").value = "";
            filesInPost.value = "";
            document.getElementById('slidesContainer').innerHTML ='';
            document.getElementById('bulletsContainer').innerHTML = '';
        });
    } else {
        const jobData = {
            useremail: userEmail,
            postinfo: postInfo,
            files: [],
        };

        socket.emit('thispost', { jobdata: jobData });
        console.log('Job Data:', jobData);
        document.querySelector("#post-content").value = "";
        filesInPost.value = "";
        document.getElementById('slidesContainer').innerHTML ='';
        document.getElementById('bulletsContainer').innerHTML = '';
    }
});

socket.on('newposts', (data) => {
    const username = data.username;
    const userprofilepic = data.userprofilepic;
    const postdata = data.postinfo;
    const postid = data.postid;
    const files = data.files;
    const time = data.posttime;


    const postHolder = document.createElement('div');
    postHolder.classList.add('postholder');

    let imagesHtml = '';
    files.forEach(file => {
        if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif')) {
            imagesHtml += `<img src="${file}" class="posterimage">`;
        } else if (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi')) {
            imagesHtml += `<video src="${file}" class="posterimage" controls></video>`;
        }
    });

    const addPost = `
             <div class="borders">
                    <div class="poster">
                        <img src="${userprofilepic}" alt="profile picture" class="posterprofilepic">
                        <div class="postinfo">
                            <div class="posternamehold">
                                <div class="postername">${username}</div>
                                <div class="position">CEO</div>
                            </div>
                            <div class="specialization">Give you a stable Job </div>
                            <div class="post-time" data-time="${time}"><ion-icon name="reload-circle-outline"></ion-icon></div>
                        </div>
                        <button class="followme"><ion-icon name="add-circle-outline"></ion-icon> Follow</button>
                    </div>
                    <div class="postercontent"><p>${postdata}</p></div>
                    <div class="slider">
                        <div class="postslides">
                            <div class="all_files">${imagesHtml}</div>
                        </div>
                    <div class="post_nxt_prev_btns">
                    <button class="prev" onclick="changeSlide(-1)">&#10094;</button>
                    <button class="next" onclick="changeSlide(1)">&#10095;</button>
                    </div>
                        <div class="bullets"></div>
                    </div>
                    <div class="interactwithpost">
                        <button class="like like-button" data-post-id="${postid}"><ion-icon name="heart"></ion-icon> Like</button>
                        <button class="comments" post-id="${postid}"><ion-icon name="chatbox-ellipses"></ion-icon> Comments</button>
                        <button class="share"><ion-icon name="share-social"></ion-icon> Share</button>
                    </div>
                   
                    <div class="givereplies">
                      <div class="fetchedchatscontainer" auth_id="${postid}"><div class="fetchedchats"><ion-icon name="refresh-circle-outline"></ion-icon></div></div>
                        <div class="leavecomment">
                        <div class="userimage"><img src="${document.getElementById('googleprofilepic').src}" alt="user image"></div>
                        <div class="userin">
                            <button type="button" class="emojis">😊</button>
                            <div contenteditable="true" type="text" class="mycomment" placeholder="leave a comment..."></div>
                            <button class="send_post_chat" chat-post-id="${postid}"><ion-icon name="send-sharp"></ion-icon></button>
                        </div>
                        </div>
                    </div>
                </div>
    `;

    postHolder.innerHTML = addPost;
    const postContainer = document.querySelector('.allpostedposts');
    postContainer.appendChild(postHolder);

    const slidesContainer = postHolder.querySelector('.postslides').firstElementChild;
    const bulletsContainer = postHolder.querySelector('.bullets');
    const slides = slidesContainer.children;
    const bullets = [];

    Array.from(slides).forEach((slide, index) => {
        const bullet = document.createElement('span');
        if (index === 0) {
            slide.classList.add('active');
            bullet.classList.add('active');
        }

        bullet.addEventListener('click', () => {
            changeSlideTo(index);
        });

        bulletsContainer.appendChild(bullet);
        bullets.push(bullet);
    });

    const updatedSendButtons = document.querySelectorAll('.leavecomment .send_post_chat');
        

    updatedSendButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const commentElement = button.previousElementSibling;
            const msg = commentElement.textContent.trim();
            const userid = document.getElementById('myprroom').textContent.trim();
            const postId = button.getAttribute('chat-post-id');

            console.log("Button clicked");
            console.log("message is:", msg);
            console.log("user:", userid);
            console.log("Post id:", postId);

            if (msg && userid && postId) {
                commentElement.textContent = "";

                fetch('/sendmessaege', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userid: userid, message: msg, post_id: postId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error('Failed to send message:', data.error);
                        return;
                    }

                    console.log('message sent successfully');
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });

    const open_comments = document.querySelectorAll('.comments');
    open_comments.forEach(comments => {
        if (!comments.dataset.listenerAdded) { // Check if listener was added before
            comments.addEventListener('click', () => {
                const chatpostid = comments.getAttribute('post-id');
                console.log("postid in chat:", chatpostid);
                if (chatpostid) {     
                    fetch('/fetchmessages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ post_id: chatpostid })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.error('Failed to load message:', data.error);
                            return;
                        }
                        const fetchedChatsContainers = document.querySelectorAll('.fetchedchatscontainer');
                        fetchedChatsContainers.forEach(container => {
                            if (container.getAttribute('auth_id') === chatpostid) {
                                container.innerHTML = ''; // Clear previous chats
                                container.classList.toggle('activecontainer_container')
                                
                                const allchats = data.chats;
                                allchats.forEach(chat => {
                                    const postid = chat.postid;
                                    const userid = chat.userid;
                                    const username = chat.username;
                                    const profilepic = chat.profilepic;
                                    const availchats = chat.availchats; // Renamed to avoid conflict
                                    const time = chat.timestamp;
                                    console.log(`Post ID: ${postid}, User ID: ${userid}, Chat: ${availchats}, Timestamp: ${time}`);
                                    
                                    const chatHTML = `
                                        <div class="fetchedchats">
                                            <img src="${profilepic}" alt="replier">
                                            <div class="content">
                                                <p class="replier">${username}</p>
                                                <p class="replies">${availchats}</p>
                                            </div>
                                        </div>
                                    `;
                                    container.innerHTML += chatHTML;
                                });
                                console.log('Messages loaded successfully');
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            });
            comments.dataset.listenerAdded = 'true'; // Mark that listener has been added
        }
    });


    let currentSlide = 0;
    let slidestartX = 0;

    function postchangeSlide(direction) {
        slides[currentSlide].classList.remove('active');
        bullets[currentSlide].classList.remove('active');

        currentSlide = (currentSlide + direction + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        bullets[currentSlide].classList.add('active');
    }

    function changeSlideTo(index) {
        slides[currentSlide].classList.remove('active');
        bullets[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        bullets[currentSlide].classList.add('active');
    }

    const prevButton = postHolder.querySelector('.prev');
    const nextButton = postHolder.querySelector('.next');

    prevButton.addEventListener('click', () => postchangeSlide(-1));
    nextButton.addEventListener('click', () => postchangeSlide(1));

    const postslider = postHolder.querySelector('.postslides');

    postslider.addEventListener('touchstart', function(e) {
        slidestartX = e.touches[0].clientX;
    });

    postslider.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        if (slidestartX > endX + 50) {
            postchangeSlide(1);
        } else if (slidestartX < endX - 50) {
            postchangeSlide(-1);
        }
    });

    postslider.addEventListener('mousedown', function(e) {
        slidestartX = e.clientX;
        postslider.style.cursor = 'grabbing';
    });

    postslider.addEventListener('mouseup', function(e) {
        const endX = e.clientX;
        postslider.style.cursor = 'grab';
        if (slidestartX > endX + 50) {
            postchangeSlide(1);
        } else if (slidestartX < endX - 50) {
            postchangeSlide(-1);
        }
    });
    updatePostTimes();
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const userEmail = document.querySelector('#usermyemail').textContent;
                
            console.log("This post id is:", postId)
            const isLiked = button.classList.contains('postliked');

            fetch('/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: postId, useremail: userEmail, like: !isLiked }) 
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    button.classList.toggle("postliked");
                    console.log('Post like status updated successfully');
                } else {
                    console.error('Failed to update like status:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });

});

//updates of user info>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let currentOffset = 0;
const chunkSize = 25;

document.addEventListener('DOMContentLoaded', () => {
    // Load initial set of posts
    updatehomeposts(currentOffset);
});

window.addEventListener('scroll', () => {
    if (document.getElementById('tab1').checked) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            // Update the current offset
            currentOffset += chunkSize;
            // Fetch next chunk of posts
            updatehomeposts(currentOffset);
        }
    }
});



function updatehomeposts(offset) {
    fetch('/loadposts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offset: offset, limit: chunkSize })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Failed to load posts:', data.error);
            return;
        }

        console.log('Posts loaded successfully');
        
        const postContainer = document.querySelector('.allpostedposts');
       // postContainer.innerHTML = '';  // Clear existing posts
        
        data.forEach(post => {
            const username = post.postername;
            const userprofilepic = post.posterprofile;
            const postdata = post.postcontent;
            const postid = post.postid;
            let files = post.postfiles;
            const date = post.postdate
        
            console.log("Files:", files);

            if (!Array.isArray(files)) {
                console.error('Files is not an array:', files);
                files = [];  // Set to empty array to avoid errors
            }

            const postHolder = document.createElement('div');
            postHolder.classList.add('postholder');

            let imagesHtml = '';
            files.forEach(file => {
                if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif')) {
                    imagesHtml += `<img src="${file}" class="posterimage">`;
                } else if (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi')) {
                    imagesHtml += `<video src="${file}" class="posterimage" controls></video>`;
                }
            });
         
            const addPost = `
                <div class="borders">
                    <div class="poster">
                        <img src="${userprofilepic}" alt="profile picture" class="posterprofilepic">
                        <div class="postinfo">
                            <div class="posternamehold">
                                <div class="postername">${username}</div>
                                <div class="position">CEO</div>
                            </div>
                            <div class="specialization">Give you a stable Job </div>
                            <div class="post-time" data-time="${post.postdate}"><ion-icon name="reload-circle-outline"></ion-icon></div>
                        </div>
                        <button class="followme"><ion-icon name="add-circle-outline"></ion-icon> Follow</button>
                    </div>
                    <div class="postercontent"><p>${postdata}</p></div>
                    <div class="slider">
                        <div class="postslides">
                            <div>${imagesHtml}</div>
                        </div>
                        <div class="post_nxt_prev_btns">
                            <button class="prev" onclick="changeSlide(-1)">&#10094;</button>
                            <button class="next" onclick="changeSlide(1)">&#10095;</button>
                            </div>
                        <div class="bullets"></div>
                    </div>
                    <div class="interactwithpost">
                        <button class="like like-button" data-post-id="${postid}"><ion-icon name="heart"></ion-icon> Like</button>
                        <button class="comments" post-id="${postid}"><ion-icon name="chatbox-ellipses"></ion-icon> Comments</button>
                        <button class="share"><ion-icon name="share-social"></ion-icon> Share</button>
                    </div>
                   
                    <div class="givereplies">
                      <div class="fetchedchatscontainer" auth_id="${postid}"><div class="fetchedchats"><ion-icon name="refresh-circle-outline"></ion-icon></div></div>
                        <div class="leavecomment">
                        <div class="userimage"><img src="${document.getElementById('googleprofilepic').src}" alt="user image"></div>
                        <div class="userin">
                            <button type="button" class="emojis">😊</button>
                            <div contenteditable="true" type="text" class="mycomment" placeholder="leave a comment..."></div>
                            <button class="send_post_chat" chat-post-id="${postid}"><ion-icon name="send-sharp"></ion-icon></button>
                        </div>
                        </div>
                    </div>
                </div>
            `;

            postHolder.innerHTML = addPost;
            postContainer.prepend(postHolder);

            // Slider functionality
            const slidesContainer = postHolder.querySelector('.postslides').firstElementChild;
            const bulletsContainer = postHolder.querySelector('.bullets');
            const slides = slidesContainer.children;
            const bullets = [];

            Array.from(slides).forEach((slide, index) => {
                const bullet = document.createElement('span');
                if (index === 0) {
                    slide.classList.add('active');
                    bullet.classList.add('active');
                }

                bullet.addEventListener('click', () => {
                    changeSlideTo(index);
                });

                bulletsContainer.appendChild(bullet);
                bullets.push(bullet);
            });
            

  
            const sendButtons = document.querySelectorAll('.leavecomment .send_post_chat');

            sendButtons.forEach(button => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            });
        
            const updatedSendButtons = document.querySelectorAll('.leavecomment .send_post_chat');
        

            updatedSendButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const commentElement = button.previousElementSibling;
                    const msg = commentElement.textContent.trim();
                    const userid = document.getElementById('myprroom').textContent.trim();
                    const postId = button.getAttribute('chat-post-id');
        
                    console.log("Button clicked");
                    console.log("message is:", msg);
                    console.log("user:", userid);
                    console.log("Post id:", postId);
        
                    if (msg && userid && postId) {
                        commentElement.textContent = "";
        
                        fetch('/sendmessaege', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userid: userid, message: msg, post_id: postId })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                console.error('Failed to send message:', data.error);
                                return;
                            }
        
                            console.log('message sent successfully');
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    }
                });
            });

            const open_comments = document.querySelectorAll('.comments');
            open_comments.forEach(comments => {
                if (!comments.dataset.listenerAdded) { // Check if listener was added before
                    comments.addEventListener('click', () => {
                        const chatpostid = comments.getAttribute('post-id');
                        console.log("postid in chat:", chatpostid);
                        if (chatpostid) {     
                            fetch('/fetchmessages', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ post_id: chatpostid })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error('Failed to load message:', data.error);
                                    return;
                                }
                                const fetchedChatsContainers = document.querySelectorAll('.fetchedchatscontainer');
                                fetchedChatsContainers.forEach(container => {
                                    if (container.getAttribute('auth_id') === chatpostid) {
                                        container.innerHTML = ''; // Clear previous chats
                                        container.classList.toggle('activecontainer_container')
                                        
                                        const allchats = data.chats;
                                        allchats.forEach(chat => {
                                            const postid = chat.postid;
                                            const userid = chat.userid;
                                            const username = chat.username;
                                            const profilepic = chat.profilepic;
                                            const availchats = chat.availchats; 
                                            const time = chat.timestamp;
                                            console.log(`Post ID: ${postid}, User ID: ${userid}, Chat: ${availchats}, Timestamp: ${time}`);
                                            
                                            const chatHTML = `
                                                <div class="fetchedchats">
                                                    <img src="${profilepic}" alt="replier">
                                                    <div class="content">
                                                        <p class="replier">${username}</p>
                                                        <p class="replies">${availchats}</p>
                                                    </div>
                                                </div>
                                            `;
                                            container.innerHTML += chatHTML;
                                        });
                                        console.log('Messages loaded successfully');
                                    }
                                });
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
 
                        }
                    });
                    comments.dataset.listenerAdded = 'true'; // Mark that listener has been added
                }
            });


            let currentSlide = 0;
            let slidestartX = 0;

            function postchangeSlide(direction) {
                slides[currentSlide].classList.remove('active');
                bullets[currentSlide].classList.remove('active');

                currentSlide = (currentSlide + direction + slides.length) % slides.length;

                slides[currentSlide].classList.add('active');
                bullets[currentSlide].classList.add('active');
            }

            function changeSlideTo(index) {
                slides[currentSlide].classList.remove('active');
                bullets[currentSlide].classList.remove('active');

                currentSlide = index;

                slides[currentSlide].classList.add('active');
                bullets[currentSlide].classList.add('active');
            }

            const prevButton = postHolder.querySelector('.prev');
            const nextButton = postHolder.querySelector('.next');

            prevButton.addEventListener('click', () => postchangeSlide(-1));
            nextButton.addEventListener('click', () => postchangeSlide(1));

            const postslider = postHolder.querySelector('.postslides');

            postslider.addEventListener('touchstart', function(e) {
                slidestartX = e.touches[0].clientX;
            });

            postslider.addEventListener('touchend', function(e) {
                const endX = e.changedTouches[0].clientX;
                if (slidestartX > endX + 50) {
                    postchangeSlide(1);
                } else if (slidestartX < endX - 50) {
                    postchangeSlide(-1);
                }
            });

            postslider.addEventListener('mousedown', function(e) {
                slidestartX = e.clientX;
                postslider.style.cursor = 'grabbing';
            });

            postslider.addEventListener('mouseup', function(e) {
                const endX = e.clientX;
                postslider.style.cursor = 'grab';
                if (slidestartX > endX + 50) {
                    postchangeSlide(1);
                } else if (slidestartX < endX - 50) {
                    postchangeSlide(-1);
                }
              
            });


          
            const nextPrevButtons = document.querySelector('.post_nxt_prev_btns');
            if (files.length <= 1) {
                nextPrevButtons.style.display = "none";
            } else {
                nextPrevButtons.style.display = "";
            }
           
         
            updatePostTimes();
            check_if_liked(post.likedusers, postHolder.querySelector('.like-button'));

            postHolder.querySelector('.like-button').addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const userEmail = document.querySelector('#usermyemail').textContent;

                console.log("This post id is:", postId);
                const isLiked = this.classList.contains('postliked');

                fetch('/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ post_id: postId, useremail: userEmail, like: !isLiked })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.classList.toggle("postliked");
                        console.log('Post like status updated successfully');
                    } else {
                        console.error('Failed to update like status:', data.error);
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });
    })
    .catch(error => console.error('Error:', error));

  
};


//chat section>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function joinChat() {
    var username = document.querySelector('#username-input').value.trim();
    if (username) {
        const send =document.querySelector('#sender')
        send.innerHTML = username;
        document.getElementById('username-form').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';

        // Join the chat room
        var room = document.getElementById('room-select').value;
        socket.emit('join', {'username': username, 'room': room});

        // Handle form submission to send messages
        document.querySelector('#message-form').onsubmit = function(event) {
            event.preventDefault();
            var recipient = document.querySelector('#recipient-input').value.trim();
            var messageInput = document.querySelector('#message-input');
            var fileInput = document.querySelector('#file-input');
            var message = messageInput.innerHTML;
            var file = fileInput.files[0];

            if (message || file) {
                var data = {
                    'msg': message,
                    'file': file ? {'name': file.name, 'url': URL.createObjectURL(file)} : null,
                    'sender': username,
                    'room': room
                };

                if (recipient) {
                    data['recipient'] = recipient;
                    socket.emit('private_message', data);
                } else {
                    socket.emit('group_message', data);
                }

                messageInput.textContent= '';
                fileInput.value = '';
            }
        };

        // Handle incoming messages from the server
        socket.on('message', function(data) {
            var sender = data.sender;
            var message = data.msg;
            var fileData = data.file ? `<br><a href="${data.file.url}" target="_blank">${data.file.name}</a>` : '';
            var room = data.room;
            function formatDate() {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date().toLocaleDateString(undefined, options);
              }

            var messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong>${sender}</strong> ${formatDate()}<br>${message}<br>${fileData}`;
            document.querySelector('#messages').appendChild(messageElement); 
            const measSender = document.getElementById('username-input').value.trim();
            if(sender === measSender){
                messageElement.classList.add('sender');
            } else if(messageElement.textContent.includes('has entered the room') ||messageElement.textContent.includes('has left the room')){
                messageElement.classList.add('msginn');
            } else {
                messageElement.classList.add('receiver');
            }
            
        });
    } else {
        alert('Please enter a username to join the chat.');
    }
}  

document.getElementById('myuserprofile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('googleprofilepic').src = e.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('googleprofilepic').src = '../static/images/nouser.png';
    }
});




socket.on('userinfoupdate',(data)=>{
    console.log("changing data")
    document.querySelectorAll(".googleprofilepic" ).forEach(S=>{
        S.src = data.profile;
    })
    document.getElementById('userphone').value = data.phone;
    const g = document.getElementsByName('gender');
    g.forEach(gndr =>{
        if (data.gender === gndr.value){
            gndr.checked = true;
        }
    })
})


socket.on('notifier', (data) => {
    console.log('Received data:', data);  // Log received data

    const username = data.username;
    const profile = data.profile_pic;
    const type = data.type;
    const time = data.time;
    const postid = data.postyid;  // Correct the variable name to postid
    const notyid = data.notyid;
    const state = data.state;  // Ensure state is defined in the emitted data
    console.log("✅state:",state)
    shownotifications(username, profile, type, time, postid, notyid, state);
});



// Ensure this interval is set only once
// Flag to prevent setting multiple intervals
let intervalSet = false;

// Function to handle notification display
function shownotifications(username, profile, type, time, postid, notyid, status) {
    const notyContainer = document.querySelector('.nofication-container'); // Ensure class name is correct

    if (!notyContainer) {
        console.error('Notification container not found.');
        return;
    }

    // Create new notification content
    let con = '';
    if (type === "comment") {
        con = `
        <div class="all_notification" my_uni_id="${notyid}" my_uni_post_id="${postid}" myunistate="${status}">
            <img src="${profile}" alt="Profile Picture">
            <div class="notification_content">
                <p>${username} commented on your post</p>
                <p class="notytime" data-time="${time}"></p>
            </div>
        </div>
        `;
    }
    if (type === "like") {
        con = `
       <div class="all_notification" my_uni_id="${notyid}" my_uni_post_id="${postid}" myunistate="${status}">
            <img src="${profile}" alt="Profile Picture">
            <div class="notification_content">
                <p>${username} liked your post</p>
                <p class="notytime" data-time="${time}"></p>
            </div>
        </div>
        `;
    }

    // Insert new notification
    notyContainer.insertAdjacentHTML('afterbegin', con);

    // Set up timeAgo updates only once
    if (!intervalSet) {
        setInterval(() => {
            const postTimes = document.querySelectorAll('.notytime');
            postTimes.forEach(postTime => {
                const time = postTime.getAttribute('data-time');
                postTime.textContent = timeAgo(time);
            });
        }, 60000);
        intervalSet = true;
    }

    // Update notification listeners
    updateNotificationListeners();
}

// Function to update event listeners on notifications
function updateNotificationListeners() {
    const notys = document.querySelectorAll('.all_notification');

    notys.forEach(noty => {
        // Check if listeners are already added
        if (!noty.dataset.listenersAdded) {
            noty.dataset.listenersAdded = 'true'; // Mark listeners as added

            const state = noty.getAttribute('myunistate');

            if (state === "unread") {
                noty.style.backgroundColor = "rgba(0, 88, 240, 0.644)";
            } else {
                noty.classList.remove('notification_unread');
            }

         
            noty.addEventListener('click', handleClick);
        }
    });
}


function handleClick(event) {
    const noty = event.currentTarget;
    if (noty) {
        const notyid = noty.getAttribute('my_uni_id');
        const mypostid = noty.getAttribute('my_uni_post_id');
        const userid = document.getElementById('myprroom').textContent.trim();
        updatenotifications(notyid, mypostid, userid);
    }
}





const typeButtons = document.querySelectorAll('.categorytns input[type="radio"]');
typeButtons.forEach(btn => {
    btn.addEventListener("change", (event) => {
        const type = event.target.id;
        switch (type) {
            case 'taball':
                updatehomejobs('all');
                break;
            case 'tabpopular':
                updatehomejobs('all');
                break;
            case 'tabtrending':
                updatehomejobs('all');
                break;
            case 'tabparttime':
                updatehomejobs('parttime');
                break;
            case 'tabfulltime':
                updatehomejobs('fulltime');
                break;
            case 'tabonline':
                updatehomejobs('online');
                break;
            default:
                // Handle default case if necessary
                break;
        }
    });
});


// <div class="inboxed-user-info"><div class="notyfications">1</div><div class="inboxed_user" onclick="joinChat()"><img src="../static/uploads/bmw-m6-red.jpeg" alt=""></div><p class="inboxed-user-name">Nicky</p></div>