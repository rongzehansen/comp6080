import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

let chatRefreshInterval = null;
let serverPollInterval = null;

function displayModalStaticBackdrop(staticBackdrop, title, message, channelId, messageId) {
    const modalTitle = staticBackdrop._element.querySelector('.modal-title');
    const modalBodyP = staticBackdrop._element.querySelector(".modal-body p");
    const modalSubmit = staticBackdrop._element.querySelector("button[type='submit']");

    modalTitle.innerText = title;
    modalBodyP.innerText = message;

    if (channelId && messageId) {
        modalSubmit.classList.remove('d-none');
        localStorage.setItem('channelId', channelId);
        localStorage.setItem('messageId', messageId);
    }
    else {
        modalSubmit.classList.add('d-none');
        localStorage.removeItem('channelId');
        localStorage.removeItem('messageId');
    }

    staticBackdrop.show();
}

function displayModalChannelCreator(channelCreator) {
    channelCreator.show();
}

function displayModalChannelEditor(channelEditor) {
    channelEditor.show();
}

function displayModalPinnedViewer(pinnedViewer) {
    pinnedViewer.show();
}

function displayModalProfileEditor(profileEditor, userId, staticBackdrop) {
    const profileEditorProfilePic = profileEditor._element.querySelector("#profileEditorImage");
    const profileEditorHeader = profileEditor._element.querySelector("#profileEditorLabel");
    const profileEditorEmail = profileEditor._element.querySelector("#profileEditorEmail");
    
    const profileEditorImageEdit = profileEditor._element.querySelector("#edit-user-image");
    const profileEditorNameEdit = profileEditor._element.querySelector("#edit-user-name");
    const profileEditorEmailEdit = profileEditor._element.querySelector("#edit-user-email");
    const profileEditorBioEdit = profileEditor._element.querySelector("#edit-user-bio");
    
    const profileEditorEdit = profileEditor._element.querySelector("#edit-user-button");
    
    if (Number(userId) !== getUserId()) profileEditorEdit.classList.add('d-none')

    getUser(userId)
        .then((user) => {
            if (user.image !== null) {
                profileEditorProfilePic.src = user.image;
            } else {
                profileEditorProfilePic.src = "../assets/images/person-circle.svg";
            }
            profileEditorEmail.innerText = user.email;
            profileEditorHeader.innerText = user.name;
            profileEditorNameEdit.value = user.name;
            profileEditorEmailEdit.value = user.email;
            profileEditorBioEdit.value = user.bio;
            profileEditor.show();
        })
        .catch((errorMessage) => {
            if (errorMessage === "TypeError: Failed to fetch") {
                displayModalStaticBackdrop(staticBackdrop, "Error", "Slackr's server is currently offline. Try again later.");
            } else {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            }
        });
}

function displayModalImageViewer(imageViewer, imgSrc, id) {
    const imageViewerImg = imageViewer._element.querySelector("#modalImage");
    const imageViewerTitle = imageViewer._element.querySelector('.modal-title');
    imageViewerImg.src = imgSrc;
    imageViewerTitle.innerText = id;
    //imageViewerImg.title = id;
    imageViewer.show();
}

function displayModalChannelInviter(channelInviter) {
    channelInviter.show();
}

function displayFormSignin(main, body, staticBackdrop) {
    main.className = 'form-signin w-100 m-auto';
    body.className = 'd-flex align-items-center py-4 bg-body-tertiary';
    const form = createFormElement("");
    const imgLogo = createImgElement("mb-4", "../assets/images/slack_logo-ebd02d1.svg", 144, 57, "Slack");
    const h1 = createHElement(1, "h3 mb-3 fw-normal", "Please sign in");
    const divEmail = createDivElement("form-floating");
    const divPassword = createDivElement("form-floating");
    const inputEmail = createInputElement("email", "form-control", "", "floatingInput", "name@example.com");
    const inputPassword = createInputElement("password", "form-control", "", "floatingPassword", "Password");
    const labelEmail = createLabelElement("", "floatingInput", "Email address");
    const labelPassword = createLabelElement("", "floatingPassword", "Password");
    const divCheckbox = createDivElement("form-check text-start my-3");
    const inputCheckbox = createInputElement("checkbox", "form-check-input", "remember-me", "flexCheckDefault", "");
    const labelCheckbox = createLabelElement("form-check-label", "flexCheckDefault", "Remember me");
    const divButtonGroup = createDivElement("d-grid gap-2");
    const buttonSignin = createButtonElement("btn btn-primary w-100 py-2", "submit", "Sign In");
    const buttonSignup = createButtonElement("btn btn-outline-primary w-100 py-2", "", "Sign Up");
    const pCopyright = createPElement("mt-5 mb-3 text-body-secondary", "© 2023 Slackr");

    main.appendChild(form);
    form.appendChild(imgLogo);
    form.appendChild(h1);
    form.appendChild(divEmail);
    form.appendChild(divPassword);
    form.appendChild(divCheckbox);
    form.appendChild(divButtonGroup);
    form.appendChild(pCopyright);
    divEmail.appendChild(inputEmail);
    divEmail.appendChild(labelEmail);
    divPassword.appendChild(inputPassword);
    divPassword.appendChild(labelPassword);
    divCheckbox.appendChild(inputCheckbox);
    divCheckbox.appendChild(labelCheckbox);
    divButtonGroup.appendChild(buttonSignin);
    divButtonGroup.appendChild(buttonSignup);

    buttonSignup.addEventListener("click", function () {
        clearMainContent(main);
        displayFormSignup(main, body, staticBackdrop);
    });

    buttonSignin.addEventListener("click", function (event) {
        event.preventDefault();
        login(inputEmail.value, inputPassword.value)
            .then((data) => {
                const { token, userId } = data;
                if (inputCheckbox.checked) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userId", userId);
                } else {
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("userId", userId);
                }
                clearMainContent(main);
                displayChannelAtMe(main, body, staticBackdrop);
            })
            .catch((errorMessage) => {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            });
    });
}

function displayFormSignup(main, body, staticBackdrop) {
    main.className = 'form-signup w-100 m-auto';
    body.className = 'd-flex align-items-center py-4 bg-body-tertiary';
    const divLogo = createDivElement("text-center");
    //const imgLogo = createImgElement("d-block mx-auto mb-4", "../assets/images/slack_logo-ebd02d1.svg", 144, 57, "Slack");
    const h2 = createHElement(2, "", "Create an account");
    const form = createFormElement("needs-validation");
    const div = createDivElement("row g-3");
    const divName = createDivElement("col-12");
    const labelName = createLabelElement("form-label", "name", "Name");
    const inputName = createInputElement("text", "form-control", "", "name", "");
    const divInvalidName = createDivElement("invalid-feedback");
    const divEmail = createDivElement("col-12");
    const labelEmail = createLabelElement("form-label", "email", "Email");
    const inputEmail = createInputElement("email", "form-control", "", "email", "you@example.com");
    const divInvalidEmail = createDivElement("invalid-feedback");
    const divPassword = createDivElement("col-sm-6");
    const labelPassword = createLabelElement("form-label", "password", "Password");
    const inputPassword = createInputElement("password", "form-control", "", "password", "Password");
    const divInvalidPassword = createDivElement("invalid-feedback");
    const divConfirmPassword = createDivElement("col-sm-6");
    const labelConfirmPassword = createLabelElement("form-label", "confirmPassword", "Confirm password");
    const inputConfirmPassword = createInputElement("password", "form-control", "", "confirmPassword", "Password");
    const divInvalidConfirmPassword = createDivElement("invalid-feedback");
    const hr = createHrElement("my-4");
    const divButtonGroup = createDivElement("d-grid gap-2");
    const buttonSignup = createButtonElement("btn btn-primary w-100 py-2", "submit", "Sign Up");
    const buttonSignin = createButtonElement("btn btn-link w-100 py-2", "", "Already have an account?");
    const pCopyright = createPElement("mt-5 mb-3 text-body-secondary", "© 2023 Slackr");

    var errorTitle = "";
    var errorMessage = "";

    inputPassword.dataset.bsToggle = "tooltip";
    inputPassword.dataset.bsPlacement = "top";
    inputPassword.dataset.bsTitle = "Password must be 8-32 characters and include a number, an uppercase letter, and a lowercase letter.";

    form.noValidate = true;
    inputName.required = true;
    inputEmail.required = true;
    inputPassword.required = true;
    inputConfirmPassword.required = true;

    divInvalidName.innerText = "It looks like that is not a valid name.";
    divInvalidEmail.innerText = "It looks like that is not a valid email address."
    divInvalidPassword.innerText = "Password must be 8-32 characters and include a number, an uppercase letter, and a lowercase letter.";
    divInvalidConfirmPassword.innerText = "Those passwords did not match."

    main.appendChild(divLogo);
    main.appendChild(form);
    main.appendChild(pCopyright)
    form.appendChild(div);
    form.appendChild(hr);
    form.appendChild(divButtonGroup);
    divLogo.appendChild(h2);
    div.appendChild(divName);
    div.appendChild(divEmail);
    div.appendChild(divPassword);
    div.appendChild(divConfirmPassword);
    divName.appendChild(labelName);
    divName.appendChild(inputName);
    divName.appendChild(divInvalidName);
    divEmail.appendChild(labelEmail);
    divEmail.appendChild(inputEmail);
    divEmail.appendChild(divInvalidEmail);
    divPassword.appendChild(labelPassword);
    divPassword.appendChild(inputPassword);
    divPassword.appendChild(divInvalidPassword);
    divConfirmPassword.appendChild(labelConfirmPassword);
    divConfirmPassword.appendChild(inputConfirmPassword);
    divConfirmPassword.appendChild(divInvalidConfirmPassword);
    divButtonGroup.appendChild(buttonSignup);
    divButtonGroup.appendChild(buttonSignin);

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    inputName.addEventListener("input", function () {
        if (!validName(inputName.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            inputName.setCustomValidity('Invalid');
        } else {
            // clear any previous error message
            inputName.setCustomValidity('');
        }
    });

    inputEmail.addEventListener("input", function () {
        if (!validEmail(inputEmail.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            inputEmail.setCustomValidity('Invalid');
        } else {
            inputEmail.setCustomValidity('');
        }
    });

    inputPassword.addEventListener("input", function () {
        if (!validPassword(inputPassword.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            inputPassword.setCustomValidity('Invalid');
        } else {
            // clear any previous error message
            inputPassword.setCustomValidity('');
        }
    });

    inputConfirmPassword.addEventListener("input", function () {
        if (!validConfirmPassword(inputPassword.value, inputConfirmPassword.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            inputConfirmPassword.setCustomValidity('Invalid');
        } else {
            // clear any previous error message
            inputConfirmPassword.setCustomValidity('');
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            event.stopPropagation();
            if (!validConfirmPassword(inputPassword.value, inputConfirmPassword.value)) {
                errorTitle = "Invalid Password";
                errorMessage = "Those passwords did not match.";
                displayModalStaticBackdrop(staticBackdrop, errorTitle, errorMessage);
            }
        } else {
            register(inputEmail.value, inputPassword.value, inputName.value)
                .then((data) => {
                    const { token, userId } = data;
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("userId", userId);
                    clearMainContent(main);
                    displayChannelAtMe(main, body, staticBackdrop);
                })
                .catch((errorMessage) => {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                });
        }

        form.classList.add('was-validated');
    }, false);

    buttonSignin.addEventListener("click", function () {
        clearMainContent(main);
        displayFormSignin(main, body, staticBackdrop);
    });
}

function displayChannelAtMe(main, body, staticBackdrop) {
    const staticBackdropSubmit = staticBackdrop._element.querySelector("button[type='submit']");
    // <!-- Modal Create -->
    const divChannelCreator = document.getElementById('channelCreator');
    const channelCreator = new bootstrap.Modal(divChannelCreator);
    const channelCreatorSubmit = channelCreator._element.querySelector("button[type='submit']");
    const channelCreatorForm = channelCreator._element.querySelector("form");
    const channelCreatorName = channelCreator._element.querySelector("#create-channel-name");
    const channelCreatorPrivate = channelCreator._element.querySelector("#create-private-check");
    const channelCreatorDescription = channelCreator._element.querySelector("#create-description-text");
    // <!-- Modal Channel Details -->
    const divChannelEditor = document.getElementById('channelEditor');
    const channelEditor = new bootstrap.Modal(divChannelEditor);
    const channelEditorEdit = channelEditor._element.querySelector("#edit-channel-button");
    const channelEditorLeave = channelEditor._element.querySelector("#leave-channel-button");
    const channelEditorSubmit = channelEditor._element.querySelector("button[type='submit']");
    const channelEditorForm = channelEditor._element.querySelector("form");
    const channelEditorName = channelEditor._element.querySelector("#edit-channel-name");
    const channelEditorPrivate = channelEditor._element.querySelector("#edit-private-check");
    const channelEditorDescription = channelEditor._element.querySelector("#edit-description-text");
    const channelEditorCreatedAt = channelEditor._element.querySelector("#channel-creation-time");
    const channelEditorCreator = channelEditor._element.querySelector("#channel-owner-name");
    // <!-- Modal -->
    const divPinnedViewer = document.getElementById('pinnedViewer');
    const pinnedViewer = new bootstrap.Modal(divPinnedViewer);
    //const pinnedViewerBody = pinnedViewer._element.querySelector(".modal-body");
    const pinnedViewerList = pinnedViewer._element.querySelector('div.list-group.list-group-flush');
    // <!-- Modal User Details -->
    const divProfileEditor = document.getElementById('profileEditor');
    const profileEditor = new bootstrap.Modal(divProfileEditor);
    const profileEditorProfilePic = profileEditor._element.querySelector("#profileEditorImage");
    const profileEditorHeader = profileEditor._element.querySelector("#profileEditorLabel");
    const profileEditorEmail = profileEditor._element.querySelector("#profileEditorEmail");
    const profileEditorForm = profileEditor._element.querySelector("form");
    const profileEditorName = profileEditor._element.querySelector("#input-group-name");
    const profileEditorPassword = profileEditor._element.querySelector("#input-group-password");

    const profileEditorImageEdit = profileEditor._element.querySelector("#edit-user-image");
    const profileEditorNameEdit = profileEditor._element.querySelector("#edit-user-name");
    const profileEditorEmailEdit = profileEditor._element.querySelector("#edit-user-email");
    const profileEditorBioEdit = profileEditor._element.querySelector("#edit-user-bio");
    const profileEditorPasswordEdit = profileEditor._element.querySelector("#edit-user-password");

    const profileEditorUpload = profileEditor._element.querySelector("#profileEditorUpload");
    const profileEditorToggle = profileEditor._element.querySelector("#togglePassword");
    const profileEditorToggleIcon = profileEditor._element.querySelector("#toggleIcon");
    const profileEditorEdit = profileEditor._element.querySelector("#edit-user-button");
    const profileEditorSubmit = profileEditor._element.querySelector("button[type='submit']");

    // <!-- Modal Image Viewer -->
    const divImageViewer = document.getElementById('imageViewer');
    const imageViewer = new bootstrap.Modal(divImageViewer);
    const imageViewerTitle = imageViewer._element.querySelector('.modal-title');
    const imageViewerLeft = imageViewer._element.querySelector("#leftArrow");
    const imageViewerRight = imageViewer._element.querySelector("#rightArrow");


    const divChannelInviter = document.getElementById('channelInviter');
    const channelInviter = new bootstrap.Modal(divChannelInviter);
    const channelInviterUl = channelInviter._element.querySelector("ul");
    const channelInviterInput = channelInviter._element.querySelector("#invite-selected-input");
    const channelInviterSubmit = channelInviter._element.querySelector("button[type='submit']");

    main.className = "main-channel d-flex flex-nowrap";
    body.className = "";

    const divSidebar = createDivElement("d-flex flex-column flex-shrink-0 p-3 text-bg-dark");
    const divLogo = createDivElement("d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none");
    const imgLogo = createImgElement("bi pe-none me-2", "../assets/images/slack_logo-ebd02d1.svg", 144, 57, "Slack");
    const ulSidebarTop = createUlElement("nav nav-pills flex-column");
    const hr0 = createHrElement("");
    const ulSidebarMiddle = createUlElement("nav nav-pills flex-column flex-nowrap overflow-auto no-scrollbar");
    const hr1 = createHrElement("mt-auto");
    const ulSidebarBottom = createUlElement("nav nav-pills flex-column");
    const liHome = createLiElement("nav-item");
    const aHome = createAElement("nav-link active", "channel/@me", "page", undefined);
    const imgHome = createImgElement("bi pe-none me-2", "../assets/images/house-door-fill.svg", 16, 16, "Home");
    const liCreate = createLiElement("nav-item");
    const aCreate = createAElement("nav-link", "#", undefined, undefined);
    const imgCreate = createImgElement("bi pe-none me-2", "../assets/images/plus-circle-fill.svg", 16, 16, "Create a channel");
    const hr2 = createHrElement("");
    const divDropdown = createDivElement("dropdown");
    const aDropdown = createAElement("d-flex align-items-center text-white text-decoration-none dropdown-toggle", "#", undefined, "false");
    const imgProfilePic = createImgElement("rounded-circle me-2", "../assets/images/person-circle.svg", 32, 32, "Avatar");
    const strongProfileName = createStrongElement("text-truncate");
    const ulDropdown = createUlElement("dropdown-menu dropdown-menu-dark text-small shadow");
    const liProfile = createLiElement("");
    const aProfile = createAElement("dropdown-item", `user/${getUserId()}`);
    const liDivider = createLiElement("");
    const hrDivider = createHrElement("dropdown-divider");
    const liSignout = createLiElement("");
    const aSignout = createAElement("dropdown-item", "#");

    const divContainer = createDivElement("d-flex flex-column flex-grow-1 text-bg-dark bg-secondary-subtle");
    divContainer.style = "min-width: 400px";

    let textNode = null;

    divSidebar.style = "width: 280px";
    aDropdown.dataset.bsToggle = "dropdown";
    aProfile.innerText = "Profile";
    aSignout.innerText = "Sign Out";

    main.appendChild(divSidebar);
    main.appendChild(divContainer);

    divSidebar.appendChild(ulSidebarTop);
    divSidebar.appendChild(hr0);
    divSidebar.appendChild(ulSidebarMiddle);
    divSidebar.appendChild(hr1);
    divSidebar.appendChild(ulSidebarBottom);
    divSidebar.appendChild(hr2);
    divSidebar.appendChild(divDropdown);
    divLogo.appendChild(imgLogo);
    ulSidebarTop.appendChild(liHome);
    ulSidebarBottom.appendChild(liCreate);
    liHome.appendChild(aHome);
    liCreate.appendChild(aCreate);
    aHome.append(imgHome);
    textNode = document.createTextNode(" Home ");
    aHome.appendChild(textNode);
    aCreate.appendChild(imgCreate);
    textNode = document.createTextNode(" Create a Channel ");
    aCreate.appendChild(textNode);
    divDropdown.appendChild(aDropdown);
    divDropdown.appendChild(ulDropdown);
    aDropdown.appendChild(imgProfilePic);
    aDropdown.appendChild(strongProfileName);
    ulDropdown.appendChild(liProfile);
    ulDropdown.appendChild(liDivider);
    ulDropdown.appendChild(liSignout);
    liProfile.appendChild(aProfile);
    liDivider.appendChild(hrDivider);
    liSignout.appendChild(aSignout);

    refreshSidebarChannelEntries(ulSidebarMiddle, divContainer, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter)
        .then(() => {
            startServerPoll();
        })
        .catch((errorMessage) => {
            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
        });

    refreshSidebarUserInfo(strongProfileName, imgProfilePic)
        .catch((errorMessage) => {
            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
        });

    aHome.addEventListener("click", function (event) {
        event.preventDefault();
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(nav => {
            nav.classList.remove('active');
            nav.removeAttribute('aria-current');
        });
        aHome.classList.add('active');
        aHome.ariaCurrent = "page";

        //stopCacheRefresh();
        stopChatRefresh();
        clearDivContent(divContainer);

        // TODO
        //displayModalChannelInviter(channelInviter);
    });

    aCreate.addEventListener("click", function (event) {
        event.preventDefault();
        aCreate.classList.add('active');
        aCreate.ariaCurrent = "page";
        displayModalChannelCreator(channelCreator);
    });

    const handleChannelCreatorSubmit = function (event) {
        event.preventDefault();
        if (!channelCreatorForm.checkValidity()) {
            event.stopPropagation();
        } else {
            createChannel(channelCreatorName.value, channelCreatorPrivate.checked, channelCreatorDescription.value)
                .then((data) => {
                    const { channelId } = data;
                    refreshSidebarChannelEntries(ulSidebarMiddle, divContainer, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter)
                        .then(() => {
                            let anchor = document.querySelector(`a[href="channel/${channelId}"]`);
                            anchor.dispatchEvent(new Event("click"));
                        })
                        .catch((errorMessage) => {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        });
                })
                .catch((errorMessage) => {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                });
            channelCreator.hide();
        }
        channelCreatorForm.classList.add('was-validated');
    };

    const handleChannelCreatorShow = function (event) {
        channelCreatorSubmit.addEventListener("click", handleChannelCreatorSubmit);
        channelCreatorForm.reset();
        channelCreatorForm.classList.remove('was-validated');
    };

    const handleChannelCreatorHide = function (event) {
        channelCreatorSubmit.removeEventListener("click", handleChannelCreatorSubmit);
        aCreate.classList.remove('active');
        aCreate.removeAttribute('aria-current');
    };

    divChannelCreator.addEventListener('hide.bs.modal', handleChannelCreatorHide);
    divChannelCreator.addEventListener('show.bs.modal', handleChannelCreatorShow);

    //
    const handleChannelEditorEdit = function (event) {
        event.preventDefault();
        channelEditorName.removeAttribute('disabled');
        channelEditorName.removeAttribute('readonly');
        channelEditorDescription.removeAttribute('disabled');
        channelEditorDescription.removeAttribute('readonly');

        channelEditorEdit.style.display = "none";
        channelEditorSubmit.style.display = "inline-block";
    };

    const handleChannelEditorLeave = function (event) {
        event.preventDefault();
        const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
        leaveChannel(channelDetails.id)
            .then(() => {
                refreshSidebarChannelEntries(ulSidebarMiddle, divContainer, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter)
                    .then(() => {
                        let anchor = document.querySelector(`a[href="channel/@me"]`);
                        //console.log(anchor);
                        anchor.dispatchEvent(new Event("click"));
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            })
            .catch((errorMessage) => {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            });
        channelEditor.hide();
    }

    const handleChannelEditorSubmit = function (event) {
        event.preventDefault();
        if (!channelEditorForm.checkValidity()) {
            event.stopPropagation();
        } else {
            const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
            updateChannel(channelDetails.id, channelEditorName.value, channelEditorDescription.value)
                .then(() => {
                    refreshSidebarChannelEntries(ulSidebarMiddle, divContainer, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter)
                        .then(() => {
                            let anchor = document.querySelector(`a[href="channel/${channelDetails.id}"]`);
                            //console.log(anchor);
                            anchor.dispatchEvent(new Event("click"));
                        })
                        .catch((errorMessage) => {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        });
                })
                .catch((errorMessage) => {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                });
            channelEditor.hide();
        }
        channelEditorForm.classList.add('was-validated');
    };

    const handleChannelEditorShow = function (event) {
        channelEditorForm.classList.remove('was-validated');
        channelEditorName.setAttribute('disabled', '');
        channelEditorName.setAttribute('readonly', '');
        channelEditorDescription.setAttribute('disabled', '');
        channelEditorDescription.setAttribute('readonly', '');

        const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
        channelEditorName.value = channelDetails.name;
        channelEditorDescription.value = channelDetails.description;
        channelEditorPrivate.checked = channelDetails.private;
        channelEditorCreatedAt.innerText = getDate(channelDetails.createdAt);

        let owner = getMember(channelDetails.creator);
        if (owner !== null) {
            channelEditorCreator.innerText = owner.name;
        } else {
            channelEditorCreator.innerText = "Unknown User";
        }

        channelEditorEdit.style.display = "inline-block";
        channelEditorSubmit.style.display = "none";

        channelEditorLeave.addEventListener("click", handleChannelEditorLeave);
        channelEditorEdit.addEventListener("click", handleChannelEditorEdit);
        channelEditorSubmit.addEventListener("click", handleChannelEditorSubmit);
    };

    const handleChannelEditorHide = function (event) {
        channelEditorLeave.removeEventListener("click", handleChannelEditorLeave);
        channelEditorEdit.removeEventListener("click", handleChannelEditorEdit);
        channelEditorSubmit.removeEventListener("click", handleChannelEditorSubmit);
    };

    divChannelEditor.addEventListener('show.bs.modal', handleChannelEditorShow);
    divChannelEditor.addEventListener('hide.bs.modal', handleChannelEditorHide);

    const handlePinnedViewerShow = function (event) {
        //let channelMessages = localStorage.getItem('channelMessages');
        let pinnedMessages = getPinnedMessages();
        for (let i = 0; i < pinnedMessages.length; i++) {
            let channelMessage = pinnedMessages[i];

            let divListGroupItem = createDivElement("list-group-item d-flex bg-secondary-subtle py-3 border-bottom-0");
            let div = createDivElement("");
            let aProfile = createAElement("");
            let imgProfile = createImgElement("rounded-circle me-3", "../assets/images/person-circle.svg", 32, 32, "Avatar");
            let divMessageContent = createDivElement("flex-grow-1");
            let divMessageHeader = createDivElement("d-flex w-100 mb-1 justify-content-start align-items-center");
            let divMessageBody = createDivElement("mb-2");
            let aName = createAElement("text-warning text-decoration-none me-2");
            let h5 = createHElement(5, "mb-0");
            let smallName = createSmallElement("text-muted");
            let spanSubMessage = createSpanElement("text-muted fw-light ms-1 small");
            let aImage = createAElement("d-none", "#");
            let imgImage = createImgElement("card-img-bottom", "", undefined, undefined, "");

            let sender = getMember(channelMessage.sender);
            let profilePicSrc = null;

            if (sender !== null) {
                profilePicSrc = sender.image;
                h5.innerText = sender.name;
            } else {
                h5.innerText = "Unknown User";
                aName.classList.remove("text-warning");
                aName.classList.add("text-secondary");
            }

            if (profilePicSrc !== null) imgProfile.src = profilePicSrc;

            if (channelMessage.edited) spanSubMessage.innerText = `(edited)`;

            if (channelMessage.image) {
                aImage.classList.remove('d-none');
                imgImage.src = channelMessage.image;
            }

            smallName.innerText = getDate(channelMessage.sentAt);
            divMessageBody.innerText = channelMessage.message;
            imgImage.style.minWidth = "280px";
            imgImage.style.maxWidth = "540px";

            imgImage.removeAttribute('width');
            imgImage.removeAttribute('height');
            aProfile.removeAttribute('href');
            aName.removeAttribute('href');
            aImage.removeAttribute('href');

            spanSubMessage.dataset.bsToggle = "tooltip";
            spanSubMessage.dataset.bsPlacement = "top";
            spanSubMessage.dataset.bsTitle = getDate(channelMessage.editedAt);

            const tooltip = new bootstrap.Tooltip(spanSubMessage);

            divListGroupItem.appendChild(div);
            divListGroupItem.appendChild(divMessageContent);

            div.appendChild(aProfile);
            divMessageContent.appendChild(divMessageHeader);
            divMessageContent.appendChild(divMessageBody);

            divMessageBody.appendChild(spanSubMessage);
            divMessageContent.appendChild(aImage);
            aImage.appendChild(imgImage);

            divMessageHeader.appendChild(aName);
            aName.appendChild(h5);
            divMessageHeader.appendChild(smallName);
            aProfile.appendChild(imgProfile);

            pinnedViewerList.appendChild(divListGroupItem);
        }
    }

    const handlePinnedViewerHide = function (event) {
        clearDivContent(pinnedViewerList);
    }

    divPinnedViewer.addEventListener('show.bs.modal', handlePinnedViewerShow);
    divPinnedViewer.addEventListener('hide.bs.modal', handlePinnedViewerHide);


    const handleProfileEditorShow = function (event) {
        profileEditorForm.classList.remove('was-validated');
    }

    const handleProfileEditorHide = function (event) {
        profileEditorUpload.classList.add("d-none");
        profileEditorEmailEdit.setAttribute("readonly", true);
        profileEditorEmailEdit.setAttribute("disabled", true);
        profileEditorBioEdit.setAttribute("readonly", true);
        profileEditorBioEdit.setAttribute("disabled", true);
        profileEditorPasswordEdit.value = "";
        profileEditorName.classList.add("d-none");
        profileEditorPassword.classList.add("d-none");
        profileEditorSubmit.classList.add("d-none");
        profileEditorEdit.classList.remove("d-none");
        profileEditorPasswordEdit.type = "password";
        profileEditorToggleIcon.src = "../assets/images/eye-slash-fill.svg";
        profileEditorProfilePic.src = "../assets/images/person-circle.svg"
    }


    divProfileEditor.addEventListener('show.bs.modal', handleProfileEditorShow);
    divProfileEditor.addEventListener('hide.bs.modal', handleProfileEditorHide);

    staticBackdropSubmit.addEventListener("click", function (event) {
        event.preventDefault();
        let channelId = localStorage.getItem('channelId');
        let messageId = localStorage.getItem('messageId');

        deleteMessage(channelId, messageId)
            .then(() => {
                staticBackdrop.hide();
                let messageEntry = divContainer.querySelector(`[id="${messageId}"]`);
                clearDivContent(messageEntry);
                messageEntry.remove();
            })
            .catch((errorMessage) => {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            });
    });

    profileEditorEdit.addEventListener("click", function (event) {
        event.preventDefault();
        profileEditorUpload.classList.remove("d-none");
        profileEditorEmailEdit.removeAttribute("readonly");
        profileEditorEmailEdit.removeAttribute("disabled");
        profileEditorBioEdit.removeAttribute("readonly");
        profileEditorBioEdit.removeAttribute("disabled");
        profileEditorName.classList.remove("d-none");
        profileEditorPassword.classList.remove("d-none");
        profileEditorSubmit.classList.remove("d-none");
        profileEditorEdit.classList.add("d-none");
    });

    profileEditorToggle.addEventListener("click", function (event) {
        event.preventDefault();
        if (profileEditorPasswordEdit.getAttribute('type') === "password") {
            profileEditorToggleIcon.src = "../assets/images/eye-fill.svg";
            profileEditorPasswordEdit.type = "text";
        } else {
            profileEditorToggleIcon.src = "../assets/images/eye-slash-fill.svg";
            profileEditorPasswordEdit.type = "password";
        }
    });

    profileEditorUpload.addEventListener("click", function (event) {
        event.preventDefault();
        profileEditorImageEdit.click();
    });

    profileEditorImageEdit.addEventListener("change", function (event) {
        event.preventDefault();
        if (profileEditorImageEdit.value) {
            profileEditorProfilePic.src = "../assets/images/image.svg";
        }
    })

    profileEditorSubmit.addEventListener("click", function (event) {
        event.preventDefault();
        let email = profileEditorEmailEdit.value;
        let password = profileEditorPasswordEdit.value;
        let name = profileEditorNameEdit.value;
        let bio = profileEditorBioEdit.value;

        if (profileEditorEmail.innerText === email) {
            email = "";
        }
        if (!profileEditorForm.checkValidity()) {
            event.stopPropagation();
        } else {
            if (profileEditorImageEdit.value) {
                fileToDataUrl(profileEditorImageEdit.files[0])
                    .then((base64) => {
                        updateProfile(email, password, name, bio, base64)
                            .then(() => {
                                refreshSidebarUserInfo(strongProfileName, imgProfilePic)
                                    .catch((errorMessage) => {
                                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                                    });
                            })
                            .catch((errorMessage) => {
                                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                            });
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });

            } else {
                updateProfile(email, password, name, bio)
                    .then(() => {
                        refreshSidebarUserInfo(strongProfileName, imgProfilePic)
                            .catch((errorMessage) => {
                                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                            });
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            }
            profileEditor.hide();
        }
        profileEditorForm.classList.add('was-validated');
    }, false);


    profileEditorNameEdit.addEventListener("input", function () {
        if (!validName(profileEditorNameEdit.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            profileEditorNameEdit.setCustomValidity('Invalid');
        } else {
            // clear any previous error message
            profileEditorNameEdit.setCustomValidity('');
        }
    });

    profileEditorEmailEdit.addEventListener("input", function () {
        if (!validEmail(profileEditorEmailEdit.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            profileEditorEmailEdit.setCustomValidity('Invalid');
        } else {
            profileEditorEmailEdit.setCustomValidity('');
        }
    });

    profileEditorPasswordEdit.addEventListener("input", function () {
        if (!validPassword(profileEditorPasswordEdit.value)) {
            // The specific message here doesn't matter, because Bootstrap will display the message from the `invalid-feedback` div.
            profileEditorPasswordEdit.setCustomValidity('Invalid');
        } else {
            // clear any previous error message
            profileEditorPasswordEdit.setCustomValidity('');
        }
    });

    const selectedUsers = [];

    function appendSelectedUser(user) {
        let div = createDivElement("d-flex user-badge bg-success m-1 text-truncate align-items-center");
        let p = createPElement("mb-0", user.name.toUpperCase());

        channelInviterInput.appendChild(div);
        div.id = user.id;
        div.appendChild(p);

        let index = selectedUsers.findIndex(x => x === Number(user.id));
        if (index === -1) {
            selectedUsers.push(Number(user.id));
        }
    }

    function removeSelectedUser(user) {
        let div = channelInviter._element.querySelector(`div[id="${user.id}"]`);
        if (div) {
            clearDivContent(div);
            div.remove();
        }

        let index = selectedUsers.findIndex(x => x === Number(user.id));
        if (index > -1) {
            selectedUsers.splice(index, 1);
        }
    }

    function appendUserEntry(user) {
        let li = createLiElement("nav-item mb-3");
        let divEntry = createDivElement("d-flex justify-content-between align-items-center");
        let a = createAElement("d-flex align-items-center text-white text-decoration-none");
        let img = createImgElement("rounded-circle me-2", "../assets/images/person-circle.svg", 32, 32, "Avatar");
        let div = createDivElement("d-flex flex-column text-truncate");
        let strong = createStrongElement("");
        let small = createSmallElement("text-muted");
        let button = createButtonElement("btn btn-outline-success", "button", "Select");

        a.removeAttribute('href');
        a.style = "width: 256px";
        strong.innerText = user.name;
        small.innerText = user.email;

        if (user.image) img.src = user.image;

        channelInviterUl.append(li);
        li.appendChild(divEntry);
        divEntry.appendChild(a);
        divEntry.appendChild(button);
        a.appendChild(img);
        a.appendChild(div);
        div.appendChild(strong);
        div.appendChild(small);

        button.addEventListener("click", function (event) {
            event.preventDefault();
            if (button.classList.contains("active")) {
                button.classList.remove("active");
                button.innerText = "Select";
                removeSelectedUser(user);
            } else {
                button.classList.add("active");
                button.innerText = "Selected";
                appendSelectedUser(user);
            }
        });
    }

    const handleChannelInviterShow = function (event) {
        getUsers()
            .then((data) => {
                getAllUsers(data.users)
                    .then((users) => {
                        users.sort((a, b) => {
                            const nameA = a.name.toUpperCase();
                            const nameB = b.name.toUpperCase();
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        });
                        //console.log(users);
                        for (let i = 0; i < users.length; i++) {
                            let channelMembers = JSON.parse(localStorage.getItem('channelMembers')).members;
                            let index = channelMembers.findIndex(member => Number(member.id) === Number(users[i].id));
                            if (index === -1) {
                                appendUserEntry(users[i]);
                            }
                        }
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            })
            .catch((errorMessage) => {
                if (errorMessage === "TypeError: Failed to fetch") {
                    displayModalStaticBackdrop(staticBackdrop, "Error", "Slackr's server is currently offline. Try again later.");
                } else {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                }
            });
    }

    const handleChannelInviterHide = function (event) {
        clearUlContent(channelInviterUl);
        clearDivContent(channelInviterInput);
    }

    divChannelInviter.addEventListener('show.bs.modal', handleChannelInviterShow);
    divChannelInviter.addEventListener('hide.bs.modal', handleChannelInviterHide);


    // TODO
    channelInviterSubmit.addEventListener("click", function (event) {
        event.preventDefault();

        let channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
        inviteSelectedUsers(selectedUsers, channelDetails.id)
            .catch((errorMessage) => {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            });

        channelInviter.hide();
    });

    imageViewerLeft.addEventListener("click", function (event) {
        event.preventDefault();
        let currImageId = imageViewer._element.querySelector('.modal-title').innerText;
        let currImageSrc = imageViewer._element.querySelector("#modalImage").src;
        let prevImageId = null;
        let prevImageSrc = null;
        let channelMessages = JSON.parse(localStorage.getItem('channelMessages')).messages.reverse();

        for (let i = 0; i < channelMessages.length; i++) {
            if (channelMessages[i].image) {
                if (Number(channelMessages[i].id) < Number(currImageId)) {
                    prevImageId = channelMessages[i].id;
                    prevImageSrc = channelMessages[i].image;
                } else {
                    break;
                }
            }
        }

        if (prevImageId !== null) {
            displayModalImageViewer(imageViewer, prevImageSrc, prevImageId);
        } else {
            displayModalImageViewer(imageViewer, currImageSrc, currImageId);
        }
    });

    imageViewerRight.addEventListener("click", function (event) {
        event.preventDefault();
        let currImageId = imageViewer._element.querySelector('.modal-title').innerText;
        let currImageSrc = imageViewer._element.querySelector("#modalImage").src;
        let nextImageId = null;
        let nextImageSrc = null;
        let channelMessages = JSON.parse(localStorage.getItem('channelMessages')).messages;
        for (let i = 0; i < channelMessages.length; i++) {
            if (channelMessages[i].image) {
                if (Number(channelMessages[i].id) > Number(currImageId)) {
                    nextImageId = channelMessages[i].id;
                    nextImageSrc = channelMessages[i].image;
                } else {
                    break;
                }
            }
        }
        if (nextImageId !== null) {
            displayModalImageViewer(imageViewer, nextImageSrc, nextImageId);
        } else {
            displayModalImageViewer(imageViewer, currImageSrc, currImageId);
        }
    });

    aProfile.addEventListener("click", function (event) {
        event.preventDefault();
        displayModalProfileEditor(profileEditor, getUserId(), staticBackdrop);
        //profileEditor.show();
    });

    aSignout.addEventListener("click", function (event) {
        event.preventDefault();
        logout()
            .then((data) => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');

                divChannelCreator.removeEventListener('hide.bs.modal', handleChannelCreatorHide);
                divChannelCreator.removeEventListener('show.bs.modal', handleChannelCreatorShow);
                divChannelEditor.removeEventListener('show.bs.modal', handleChannelEditorShow);
                divChannelEditor.removeEventListener('hide.bs.modal', handleChannelEditorHide);
                divPinnedViewer.removeEventListener('show.bs.modal', handlePinnedViewerShow);
                divPinnedViewer.removeEventListener('hide.bs.modal', handlePinnedViewerHide);
                divProfileEditor.removeEventListener('show.bs.modal', handleProfileEditorShow);
                divProfileEditor.removeEventListener('hide.bs.modal', handleProfileEditorHide);
                divChannelInviter.removeEventListener('show.bs.modal', handleChannelInviterShow);
                divChannelInviter.removeEventListener('hide.bs.modal', handleChannelInviterHide);

                stopChatRefresh();
                stopServerPoll();
                clearMainContent(main);
                location.reload(true);
                //displayFormSignin(main, body, staticBackdrop);
            })
            .catch((errorMessage) => {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            });
    });
}

function displayChannelAtId(channelId, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter) {
    const divAlert = createDivElement("alert alert-primary mb-0");
    const divNotificationBar = createDivElement("alert alert-info mb-0 text-center d-none");
    const aAlert = createAElement("alert-link", "#");
    const navbar = createNavElement("navbar navbar-expand-md navbar-dark bg-dark");
    const divContainer = createDivElement("container-fluid");
    const aBrand = createAElement("navbar-brand text-truncate", "#");
    const buttonToggler = createButtonElement("navbar-toggler", "button", "");
    const spanToggler = createSpanElement("navbar-toggler-icon");
    const divNavbarCollapse = createDivElement("collapse navbar-collapse");
    const ulNavbarCollapse = createUlElement("navbar-nav ms-auto me-2 mb-2 mb-md-0");
    const liPinnedMessages = createLiElement("nav-item");
    const aPinnedMessages = createAElement("nav-link d-none", "#");
    const imgPinnedMessages = createImgElement("bi pe-none me-2", "../assets/images/pin-angle-fill.svg", 16, 16, "Pinned messages");
    const liMemberList = createLiElement("nav-item");
    const aMemberList = createAElement("nav-link d-none", "#");
    const imgMemberList = createImgElement("bi pe-none me-2", "../assets/images/person-plus-fill.svg", 16, 16, "Member list");

    const spanPinnedMessages = createSpanElement("d-md-none");
    const spanMemberList = createSpanElement("d-md-none");
    const imgBrand = createImgElement("bi pe-none me-2", "../assets/images/channel-fill.svg", 16, 16, "Private channel");

    const divChat = createDivElement("list-group list-group-flush scrollarea");
    const divInput = createDivElement("container-fluid mt-auto mb-4");

    const formInput = createFormElement("");
    const divInputGroup = createDivElement("input-group");
    const buttonInputUpload = createButtonElement("btn btn-secondary", "button", "");
    const imgInputUpload = createImgElement("bi pe-none", "../assets/images/plus-circle-fill.svg", 16, 16, "Upload a image");
    const inputImage = createInputElement("file", "form-control d-none", "", "", "");
    const textareaMessage = createTextareaElement("form-control", "", "Message #", 1);
    const buttonInputSubmit = createButtonElement("btn btn-primary", "submit", "Send");

    const divFiles = createDivElement("bg-dark p-3 rounded-top d-none");
    const divFile = createDivElement("card");
    const divDelete = createDivElement("position-absolute top-0 end-0");
    const buttonDelete = createButtonElement("btn bg-body-tertiary btn-md d-flex align-items-center justify-content-center shadow", "button", "");
    const imgDelete = createImgElement("bi pe-none", "../assets/images/trash3-fill.svg", 16, 16, "Remove attachment");
    const divFileBody = createDivElement("card-body");
    const imgFileBody = createImgElement("card-img-top", "../assets/images/file-earmark-image.svg", undefined, undefined, "");
    const divFileFooter = createDivElement("card-footer");
    const pFileFooter = createPElement("card-text text-truncate", "");

    let textNode = null;

    divFile.style = "width: 8rem";
    divAlert.role = "alert";
    divNotificationBar.role = "alert";
    aBrand.style = "max-width: 320px"
    divNavbarCollapse.id = "navbarCollapse";
    buttonToggler.dataset.bsToggle = "collapse";
    buttonToggler.dataset.bsTarget = "#navbarCollapse";
    buttonToggler.setAttribute("aria-controls", "navbarCollapse");
    buttonToggler.ariaExpanded = "false";
    buttonToggler.ariaLabel = "Toggle navigation";
    //textareaMessage.required = "true";

    imgFileBody.removeAttribute('width');
    imgFileBody.removeAttribute('height');

    spanPinnedMessages.innerText = "Pinned Messages";
    spanMemberList.innerText = "Member List";

    divNode.appendChild(divNotificationBar);

    divNode.appendChild(navbar);
    divNode.appendChild(divChat);
    divNode.append(divInput);
    navbar.appendChild(divContainer);
    divContainer.appendChild(aBrand);
    divContainer.appendChild(buttonToggler);
    divContainer.appendChild(divNavbarCollapse);
    aBrand.appendChild(imgBrand);
    buttonToggler.appendChild(spanToggler);
    divNavbarCollapse.appendChild(ulNavbarCollapse);
    ulNavbarCollapse.appendChild(liPinnedMessages);
    ulNavbarCollapse.appendChild(liMemberList);
    liPinnedMessages.appendChild(aPinnedMessages);
    liMemberList.appendChild(aMemberList);
    aPinnedMessages.appendChild(imgPinnedMessages);

    aPinnedMessages.appendChild(spanPinnedMessages);
    aMemberList.appendChild(imgMemberList);

    aMemberList.appendChild(spanMemberList);

    divInput.appendChild(formInput);
    formInput.appendChild(divFiles);
    formInput.appendChild(divInputGroup);
    divInputGroup.appendChild(buttonInputUpload);
    divInputGroup.appendChild(inputImage);
    divInputGroup.appendChild(textareaMessage);
    divInputGroup.appendChild(buttonInputSubmit);
    buttonInputUpload.appendChild(imgInputUpload);

    divFiles.appendChild(divFile);
    divFile.appendChild(divDelete);
    divFile.appendChild(divFileBody);
    divFile.appendChild(divFileFooter);
    divDelete.appendChild(buttonDelete);
    buttonDelete.appendChild(imgDelete);
    divFileBody.appendChild(imgFileBody);
    divFileFooter.appendChild(pFileFooter);

    cacheChannelDetails(channelId)
        .then(() => {
            const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
            if (channelDetails.private) {
                imgBrand.src = "../assets/images/channel-fill-lock.svg";
            }
            textNode = document.createTextNode(channelDetails.name);
            aBrand.appendChild(textNode);

            textareaMessage.placeholder = `Message #${channelDetails.name}`;

            cacheChannelMembers()
                .then(() => {
                    cacheChannelMessages(channelId)
                        .then(() => {
                            // TEST
                            let newMessage = JSON.parse(localStorage.getItem('channelMessages')).messages[0];
                            let newMessageId = 0;
                            if (newMessage) newMessageId = newMessage.id;
                            let messageViewed = JSON.parse(localStorage.getItem('messageViewed'));
                            if (!messageViewed) messageViewed = {};
                            messageViewed[channelId] = newMessageId;
                            localStorage.setItem('messageViewed', JSON.stringify(messageViewed));
                            
                            let img = document.getElementById(`channel-${channelId}`);
                            if (img) img.classList.add("d-none");
                        
                            displayChatHistory(divChat, staticBackdrop, profileEditor, imageViewer);
                            startChatRefresh(divChat, staticBackdrop, divNotificationBar, profileEditor, imageViewer);
                            aPinnedMessages.classList.remove("d-none");
                            aMemberList.classList.remove("d-none");
                        })
                        .catch((errorMessage) => {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        });
                })
                .catch((errorMessage) => {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                });
        })
        .catch((errorMessage) => {
            if (errorMessage === "Authorised user is not a member of this channel") {
                clearDivContent(divNode);
                aAlert.innerText = "Join"
                textNode = document.createTextNode(" this channel to start chatting!");
                divNode.appendChild(divAlert);
                divAlert.appendChild(aAlert);
                divAlert.appendChild(textNode);

                aAlert.addEventListener("click", function (event) {
                    event.preventDefault();
                    joinChannel(channelId)
                        .then(() => {
                            clearDivContent(divNode);
                            displayChannelAtId(channelId, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                        })
                        .catch((errorMessage) => {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        });
                });
            } else if (errorMessage === "TypeError: Failed to fetch") {
                divNotificationBar.innerText = "You are disconnected. Offline Mode is enabled.";
                divNotificationBar.classList.remove("d-none");

                const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
                if (channelDetails.private) {
                    imgBrand.src = "../assets/images/channel-fill-lock.svg";
                }
                textNode = document.createTextNode(channelDetails.name);
                aBrand.appendChild(textNode);

                textareaMessage.placeholder = `Message #${channelDetails.name}`;
                
                let img = document.getElementById(`channel-${channelId}`);
                if (img) img.classList.add("d-none");
                
                displayChatHistory(divChat, staticBackdrop, profileEditor, imageViewer);
                aPinnedMessages.classList.remove("d-none");
                aMemberList.classList.remove("d-none");

            } else {
                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
            }
        });

    aBrand.addEventListener("click", function (event) {
        event.preventDefault();
        displayModalChannelEditor(channelEditor);
    });

    aPinnedMessages.addEventListener("click", function (event) {
        event.preventDefault();
        displayModalPinnedViewer(pinnedViewer);
    });

    aMemberList.addEventListener("click", function (event) {
        event.preventDefault();
        displayModalChannelInviter(channelInviter);
    });

    buttonInputUpload.addEventListener("click", function (event) {
        event.preventDefault();
        inputImage.click();
    });

    inputImage.addEventListener("change", function (event) {
        event.preventDefault();
        pFileFooter.textContent = inputImage.files[0].name;
        divFiles.classList.remove("d-none");
        buttonInputUpload.classList.add("rounded-top-0");
        buttonInputSubmit.classList.add("rounded-top-0");
    });

    buttonDelete.addEventListener("click", function (event) {
        event.preventDefault();
        inputImage.value = '';
        divFiles.classList.add("d-none");
        buttonInputUpload.classList.remove("rounded-top-0");
        buttonInputSubmit.classList.remove("rounded-top-0");
    });

    formInput.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validMessage(textareaMessage.value, inputImage.value)) {
            event.stopPropagation();
        } else {
            let message = textareaMessage.value.trim();
            let image = "";
            if (inputImage.value) {
                fileToDataUrl(inputImage.files[0])
                    .then((base64) => {
                        image = base64;
                        sendMessage(channelId, message, image)
                            .then(() => {
                                refreshChannelAtId(channelId, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                            })
                            .catch((errorMessage) => {
                                displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                            });
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            } else {
                sendMessage(channelId, message)
                    .then(() => {
                        refreshChannelAtId(channelId, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            }
        }
    }, false);
}

function displayChatHistory(divNode, staticBackdrop, profileEditor, imageViewer) {
    const channelMessages = JSON.parse(localStorage.getItem('channelMessages')).messages.reverse();
    appendMessageEntries(divNode, channelMessages, staticBackdrop, profileEditor, imageViewer);
    divNode.scrollTop = divNode.scrollHeight;
}

function updateMessageReacts(divNode, reacts) {
    let reactCounts = getReactCounts(reacts);
    let reactFlags = getReactFlags(reacts);

    for (let key in reactCounts) {
        if (reactCounts.hasOwnProperty(key)) {
            let button = divNode.querySelector(`[id="${key}"]`);
            let span = button.querySelector("span");
            span.innerText = reactCounts[key];

            if (reactFlags[key]) {
                button.classList.add("active");
                button.ariaPressed = true;
            } else {
                button.classList.remove("active");
                button.removeAttribute("ariaPressed");
            }

            if (Number(reactCounts[key]) === 0) {
                button.classList.add("d-none");
            } else {
                button.classList.remove("d-none");
            }
        }
    }
}

function updateMessageEntry(divNode, channelMessage, staticBackdrop, profileEditor, imageViewer) {
    clearDivContent(divNode);
    const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
    let div = createDivElement("");
    let aProfile = createAElement("", `user/${channelMessage.sender}`);
    let imgProfile = createImgElement("rounded-circle me-3", "../assets/images/person-circle.svg", 32, 32, "Avatar");
    let divMessageContent = createDivElement("flex-grow-1");
    let divMessageHeader = createDivElement("d-flex w-100 mb-1 justify-content-start align-items-center");
    let aName = createAElement("text-warning text-decoration-none me-2", `user/${channelMessage.sender}`);
    let h5 = createHElement(5, "mb-0");
    let smallName = createSmallElement("text-muted");
    let divMessageBody = createDivElement("mb-2");
    let formMessageEdit = createFormElement("my-2 d-none");
    let divMessageInputGroup = createDivElement("input-group-append mb-2");
    let textareaMessageEdit = createTextareaElement("form-control rounded-bottom-0", channelMessage.message, "");
    let inputImageEdit = createInputElement("file", "form-control rounded-top-0", "", "", "");
    let buttonMessageEditSubmit = createButtonElement("btn btn-outline-info btn-sm", "submit", "Save");
    let buttonMessageEditCancel = createButtonElement("btn btn-outline-light btn-sm me-1", "button", "Cancel");
    let spanSubMessage = createSpanElement("text-muted fw-light ms-1 small");
    let aImage = createAElement("d-none", "#");
    let imgImage = createImgElement("card-img-bottom", "", undefined, undefined, "");

    let divToolbar = createDivElement("btn-toolbar hover-buttons position-absolute top-0 end-0 me-3");
    let divButtonGroup = createDivElement("btn-group me-2");
    let divReactGroup = createDivElement("btn-group me-2 d-none");

    let buttonReact = createButtonElement("btn btn-secondary btn-sm", "button", "");
    let buttonEdit = createButtonElement("btn btn-secondary btn-sm d-none", "button", "");
    let buttonPin = createButtonElement("btn btn-secondary btn-sm", "button", "");
    let buttonDelete = createButtonElement("btn btn-secondary btn-sm d-none", "button", "");
    let imgReact = createImgElement("bi pe-none", "../assets/images/emoji-smile-fill.svg", 16, 16);
    let imgEdit = createImgElement("bi pe-none", "../assets/images/pencil-fill.svg", 16, 16);
    let imgPin = createImgElement("bi pe-none", "../assets/images/pin-angle-fill.svg", 16, 16);
    let imgDelete = createImgElement("bi pe-none", "../assets/images/trash3-fill.svg", 16, 16);

    let divReacts = createDivElement("d-flex mt-1");

    let sender = getMember(channelMessage.sender);
    let profilePicSrc = null;

    if (sender !== null) {
        profilePicSrc = sender.image;
        h5.innerText = sender.name;
    } else {
        h5.innerText = "Unknown User";
        aName.classList.remove("text-warning");
        aName.classList.add("text-secondary");
        aProfile.removeAttribute("href");
        aName.removeAttribute("href");
    }

    if (profilePicSrc !== null) imgProfile.src = profilePicSrc;

    if (channelMessage.edited) spanSubMessage.innerText = `(edited)`;

    if (channelMessage.image) {
        aImage.classList.remove('d-none');
        imgImage.src = channelMessage.image;
    }

    if (Number(channelMessage.sender) === getUserId()) {
        buttonEdit.classList.remove('d-none');
        buttonDelete.classList.remove('d-none');
    }

    if (channelMessage.pinned) {
        buttonPin.classList.add("active");
        buttonPin.ariaPressed = true;
    } else {
        buttonPin.classList.remove("active");
        buttonPin.remove("aria-pressed");
    }


    smallName.innerText = getDate(channelMessage.sentAt);
    divMessageBody.innerText = channelMessage.message;
    imgImage.style.minWidth = "280px";
    imgImage.style.maxWidth = "540px";

    imgImage.removeAttribute('width');
    imgImage.removeAttribute('height');

    spanSubMessage.dataset.bsToggle = "tooltip";
    spanSubMessage.dataset.bsPlacement = "top";
    spanSubMessage.dataset.bsTitle = getDate(channelMessage.editedAt);

    const tooltip = new bootstrap.Tooltip(spanSubMessage);

    divNode.appendChild(div);
    divNode.appendChild(divMessageContent);
    divNode.appendChild(divToolbar);
    //divNode.appendChild(divButtonGroup);

    div.appendChild(aProfile);
    divMessageContent.appendChild(divMessageHeader);
    divMessageContent.appendChild(divMessageBody);
    divMessageContent.appendChild(formMessageEdit);
    formMessageEdit.appendChild(divMessageInputGroup);
    divMessageInputGroup.appendChild(textareaMessageEdit);
    divMessageInputGroup.appendChild(inputImageEdit);

    formMessageEdit.appendChild(buttonMessageEditCancel);
    formMessageEdit.appendChild(buttonMessageEditSubmit);

    divMessageBody.appendChild(spanSubMessage);
    divMessageContent.appendChild(aImage);
    aImage.appendChild(imgImage);

    divMessageContent.appendChild(divReacts);
    divMessageHeader.appendChild(aName);
    aName.appendChild(h5);
    divMessageHeader.appendChild(smallName);
    aProfile.appendChild(imgProfile);
    divToolbar.appendChild(divReactGroup);
    divToolbar.appendChild(divButtonGroup);
    divButtonGroup.appendChild(buttonReact);
    divButtonGroup.appendChild(buttonEdit);
    divButtonGroup.appendChild(buttonDelete);
    divButtonGroup.appendChild(buttonPin);

    buttonReact.appendChild(imgReact);
    buttonEdit.appendChild(imgEdit);
    buttonDelete.appendChild(imgDelete);
    buttonPin.appendChild(imgPin);

    const divBtnGroup = createDivElement("btn-toolbar");
    divBtnGroup.role = "toolbar";

    function createTopReactButton(emoji, id) {
        let button = createButtonElement("btn btn-primary btn-sm", "button", emoji);

        button.addEventListener("click", function (event) {
            event.preventDefault();
            divReactGroup.classList.add('d-none');
            let button = divNode.querySelector(`[id="${id}"]`);
            button.dispatchEvent(new Event("click"));
        });

        return button;
    }

    function createBottomReactButton(emoji, id) {
        let button = createButtonElement("btn btn-outline-primary btn-sm me-1", "button", "");
        //let img = createImgElement("", imgSrc, 16, 16, id);
        let span = createSpanElement("ms-1");
        span.innerText = 0;
        button.id = id;
        button.innerText = emoji;

        button.appendChild(span);

        button.addEventListener("click", function (event) {
            event.preventDefault();
            let reactFlags = getReactFlags(channelMessage.reacts);
            if (reactFlags[id]) {
                unreactMessage(channelDetails.id, channelMessage.id, id)
                    .then(() => {
                        channelMessage.reacts = channelMessage.reacts.filter(react => Number(react.user) !== getUserId() || react.react !== id);
                        updateMessageReacts(divReacts, channelMessage.reacts);
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            } else {
                reactMessage(channelDetails.id, channelMessage.id, id)
                    .then(() => {
                        channelMessage.reacts.push({ user: getUserId(), react: id });
                        updateMessageReacts(divReacts, channelMessage.reacts);
                    })
                    .catch((errorMessage) => {
                        displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                    });
            }
        });

        return button;
    }

    divReacts.appendChild(divBtnGroup);
    divBtnGroup.appendChild(createBottomReactButton("😍", "heart-eyes"));
    divBtnGroup.appendChild(createBottomReactButton("😁", "grin"));
    divBtnGroup.appendChild(createBottomReactButton("😬", "grimace"));
    divBtnGroup.appendChild(createBottomReactButton("☹️", "frown"));
    divBtnGroup.appendChild(createBottomReactButton("😑", "expressionless"));
    //divBtnGroup.appendChild(createBottomReactButton("😵", "dizzy"));
    //divBtnGroup.appendChild(createBottomReactButton("😲", "astonished"));

    divReactGroup.appendChild(createTopReactButton("😍", "heart-eyes"));
    divReactGroup.appendChild(createTopReactButton("😁", "grin"));
    divReactGroup.appendChild(createTopReactButton("😬", "grimace"));
    divReactGroup.appendChild(createTopReactButton("☹️", "frown"));
    divReactGroup.appendChild(createTopReactButton("😑", "expressionless"));
    //divReactGroup.appendChild(createTopReactButton("😵", "dizzy"));
    //divReactGroup.appendChild(createTopReactButton("😲", "astonished"));

    updateMessageReacts(divReacts, channelMessage.reacts);

    buttonReact.addEventListener("click", function (event) {
        event.preventDefault();
        if (divReactGroup.classList.contains("d-none")) {
            divReactGroup.classList.remove('d-none');
        } else {
            divReactGroup.classList.add('d-none');
        }
    })

    buttonPin.addEventListener("click", function (event) {
        event.preventDefault();
        if (buttonPin.classList.contains("active") && buttonPin.ariaPressed) {
            unpinMessage(channelDetails.id, channelMessage.id)
                .then(() => {
                    buttonPin.classList.remove("active");
                    //
                    buttonPin.removeAttribute("aria-pressed");
                })
                .catch((errorMessage) => {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                });

        } else {
            pinMessage(channelDetails.id, channelMessage.id)
                .then(() => {
                    buttonPin.classList.add("active");
                    //
                    buttonPin.ariaPressed = true;
                })
                .catch((errorMessage) => {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                });
        }
    });

    if (sender !== null) {
        aName.addEventListener("click", function (event) {
            event.preventDefault();
            displayModalProfileEditor(profileEditor, channelMessage.sender, staticBackdrop);
        });

        aProfile.addEventListener("click", function (event) {
            event.preventDefault();
            displayModalProfileEditor(profileEditor, channelMessage.sender, staticBackdrop);
        });
    }

    spanSubMessage.addEventListener("shown.bs.tooltip", function (event) {
        event.preventDefault();
        spanSubMessage.dataset.bsTitle = getEditedDate(channelMessage.id);
    });

    buttonEdit.addEventListener("click", function (event) {
        event.preventDefault();
        formMessageEdit.classList.remove('d-none');
        divMessageBody.classList.add('d-none');
    });

    buttonMessageEditCancel.addEventListener("click", function (event) {
        event.preventDefault();
        formMessageEdit.classList.add('d-none');
        divMessageBody.classList.remove('d-none');
    });

    buttonDelete.addEventListener("click", function (event) {
        event.preventDefault();
        displayModalStaticBackdrop(staticBackdrop, "Delete Message", "Are you sure you want to delete this message?", channelDetails.id, channelMessage.id);
    });

    aImage.addEventListener("click", function (event) {
        event.preventDefault();
        displayModalImageViewer(imageViewer, imgImage.src, channelMessage.id);
    });

    formMessageEdit.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validMessageEdit(textareaMessageEdit.value, channelMessage.message, inputImageEdit.value)) {
            event.stopPropagation();
        } else {
            if (!validMessage(textareaMessageEdit.value, inputImageEdit.value)) {
                // delete message
                displayModalStaticBackdrop(staticBackdrop, "Delete Message", "Are you sure you want to delete this message?", channelDetails.id, channelMessage.id);
            } else {
                let message = textareaMessageEdit.value.trim();
                let image = "";
                if (inputImageEdit.value) {
                    fileToDataUrl(inputImageEdit.files[0])
                        .then((base64) => {
                            image = base64;
                            updateMessage(channelDetails.id, channelMessage.id, message, image)
                                .then(() => {
                                    channelMessage.message = message;
                                    channelMessage.image = image;
                                    channelMessage.edited = true;
                                    channelMessage.editedAt = new Date().toISOString();
                                    updateMessageEntry(divNode, channelMessage, staticBackdrop, profileEditor, imageViewer);
                                })
                                .catch((errorMessage) => {
                                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                                });
                        })
                        .catch((errorMessage) => {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        });
                } else {
                    updateMessage(channelDetails.id, channelMessage.id, message)
                        .then(() => {
                            channelMessage.message = message;
                            channelMessage.image = image;
                            channelMessage.edited = true;
                            channelMessage.editedAt = new Date().toISOString();
                            updateMessageEntry(divNode, channelMessage, staticBackdrop, profileEditor, imageViewer);
                        })
                        .catch((errorMessage) => {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        });
                }
            }
        }
    }, false);
}

function appendMessageEntry(divNode, channelMessage, staticBackdrop, profileEditor, imageViewer) {
    const divListGroupItem = createDivElement("list-group-item d-flex bg-secondary-subtle py-3 border-bottom-0");
    divListGroupItem.id = channelMessage.id;
    divNode.appendChild(divListGroupItem);

    updateMessageEntry(divListGroupItem, channelMessage, staticBackdrop, profileEditor, imageViewer);
}

function appendMessageEntries(divNode, channelMessages, staticBackdrop, profileEditor, imageViewer) {
    for (let i = 0; i < channelMessages.length; i++) {
        appendMessageEntry(divNode, channelMessages[i], staticBackdrop, profileEditor, imageViewer);
    }
}

function cacheChannelDetails(channelId) {
    return new Promise((resolve, reject) => {
        getChannel(channelId)
            .then((data) => {
                data.id = channelId;
                localStorage.setItem('channelDetails', JSON.stringify(data));
                resolve();
            })
            .catch((errorMessage) => {
                //displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                reject(errorMessage);
            });
    });
}

// called after cacheChannelDetails() finish
function cacheChannelMembers() {
    return new Promise((resolve, reject) => {
        const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));

        const memberPromises = channelDetails.members.map(memberId => {
            return getUser(memberId)
                .then(user => {
                    // Attach the memberId to the user object
                    user.id = memberId;
                    return user;
                })
                .catch(errorMessage => {
                    // Reject the promise so that Promise.all stops immediately on error
                    return Promise.reject(errorMessage);
                });
        });

        Promise.all(memberPromises)
            .then(usersList => {
                // 'usersList' contains the response of all 'getUser' promises in order
                const result = { members: usersList };
                localStorage.setItem('channelMembers', JSON.stringify(result));
                resolve(result);  // Resolve the outer promise with the result
            })
            .catch(errorMessage => {
                // Handle error if any of the promises rejects
                reject(errorMessage);  // Reject the outer promise with the error message
            });
    });
}

function cacheChannelMessages(channelId) {
    let allMessages = [];

    function getAndCache(start) {
        return getMessages(channelId, start)
            .then(response => {
                // Add the fetched messages to the allMessages array
                allMessages = allMessages.concat(response.messages);

                // If we fetched 25 messages, there might be more to fetch
                if (response.messages.length === 25) {
                    return getAndCache(start + 25); // Fetch next batch
                }
            });
    }

    return getAndCache(0)
        .then(() => {
            const storageObj = { messages: allMessages };
            localStorage.setItem('channelMessages', JSON.stringify(storageObj));
        })
        .catch(errorMessage => {
            return Promise.reject(errorMessage);
        });
}

function inviteSelectedUsers(users, channelId) {
    return new Promise((resolve, reject) => {
        const userPromises = users.map(userId => {
            return inviteChannel(channelId, userId)
                .catch(errorMessage => {
                    // Reject the promise so that Promise.all stops immediately on error
                    return Promise.reject(errorMessage);
                });
        })

        Promise.all(userPromises)
            .then(() => {
                resolve();
            })
            .catch(errorMessage => {
                reject(errorMessage);
            });
    });
}

function getAllUsers(users) {
    return new Promise((resolve, reject) => {
        const userPromises = users.map(userObj => {
            return getUser(userObj.id)
                .then(user => {
                    user.id = userObj.id;
                    return user;
                })
                .catch(errorMessage => {
                    // Reject the promise so that Promise.all stops immediately on error
                    return Promise.reject(errorMessage);
                });
        });

        Promise.all(userPromises)
            .then(usersList => {
                // 'usersList' contains the response of all 'getUser' promises in order
                const result = usersList;
                resolve(result);  // Resolve the outer promise with the result
            })
            .catch(errorMessage => {
                // Handle error if any of the promises rejects
                reject(errorMessage);  // Reject the outer promise with the error message
            });
    });
}

function refreshSidebarUserInfo(strongNode, imgNode) {
    return new Promise((resolve, reject) => {
        getUser(getUserId())
            .then((user) => {
                localStorage.setItem('user', JSON.stringify(user));
                strongNode.innerText = user.name;
                if (user.image !== null) {
                    imgNode.src = user.image;
                }
                resolve();
            })
            .catch((errorMessage) => {
                //displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                if (errorMessage === "TypeError: Failed to fetch") {
                    let user = JSON.parse(localStorage.getItem('user'));
                    strongNode.innerText = user.name;
                    if (user.image !== null) {
                        imgNode.src = user.image;
                    }
                } else {
                    reject(errorMessage);
                }
            });
    })
}

function refreshSidebarChannelEntries(ulNode, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter) {
    return new Promise((resolve, reject) => {
        clearUlContent(ulNode);
        getChannels()
            .then((data) => {
                let privateChannels = getJoinedPrivateChannels(data, getUserId());
                let publicChannels = getAllPublicChannels(data);
                localStorage.setItem('privateChannels', JSON.stringify(privateChannels));
                localStorage.setItem('publicChannels', JSON.stringify(publicChannels));
                appendChannelEntries(ulNode, privateChannels, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                appendChannelEntries(ulNode, publicChannels, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                resolve();
            })
            .catch((errorMessage) => {
                //displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                if (errorMessage === "TypeError: Failed to fetch") {
                    let privateChannels = JSON.parse(localStorage.getItem('privateChannels'));
                    let publicChannels = JSON.parse(localStorage.getItem('publicChannels'));
                    appendChannelEntries(ulNode, privateChannels, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                    appendChannelEntries(ulNode, publicChannels, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
                } else {
                    reject(errorMessage);
                }
            });
    });
}

function refreshChannelAtId(channelId, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter) {
    clearDivContent(divNode);
    displayChannelAtId(channelId, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter)
}

function appendChannelEntry(channel, ulNode, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter) {
    let liChannel = createLiElement("nav-item");
    let aChannel = createAElement("nav-link d-flex align-items-center justify-content-between", `channel/${channel.id}`, undefined, undefined);
    let span = createSpanElement("text-truncate");
    let imgExclamation = createImgElement("d-none", "../assets/images/envelope-exclamation-fill.svg", 16, 16, "");
    let imgChannel = channel.private
        ? createImgElement("bi pe-none me-2", "../assets/images/channel-fill-lock.svg", 16, 16, "Private channel")
        : createImgElement("bi pe-none me-2", "../assets/images/channel-fill.svg", 16, 16, "Public channel");
    let textNode = document.createTextNode(` ${channel.name} `);
    
    imgExclamation.id = `channel-${channel.id}`;
    
    ulNode.appendChild(liChannel);
    liChannel.appendChild(aChannel);
    aChannel.appendChild(span);
    aChannel.appendChild(imgExclamation);
    span.appendChild(imgChannel);
    span.appendChild(textNode);
    
    aChannel.addEventListener("click", function (event) {
        event.preventDefault();
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(nav => {
            nav.classList.remove('active');
            nav.removeAttribute('aria-current');
        });
        aChannel.classList.add('active');
        aChannel.ariaCurrent = "page";

        stopChatRefresh();
        clearDivContent(divNode);
        displayChannelAtId(channel.id, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
    });
}

function appendChannelEntries(ulNode, channels, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter) {
    for (let i = 0; i < channels.length; i++) {
        appendChannelEntry(channels[i], ulNode, divNode, staticBackdrop, channelEditor, pinnedViewer, profileEditor, imageViewer, channelInviter);
    }
}

// HTMLElement
function createNavElement(className) {
    const nav = document.createElement("nav");
    nav.className = className;
    return nav;
}

// HTMLElement
function createSpanElement(className) {
    const span = document.createElement("span");
    span.className = className;
    return span;
}

// HTMLElement
function createAElement(className, href, ariaCurrent, ariaExpanded) {
    const a = document.createElement("a");
    a.className = className;
    a.href = href;
    a.ariaCurrent = ariaCurrent;
    a.ariaExpanded = ariaExpanded;
    return a;
}

// HTMLElement
function createStrongElement(className) {
    const strong = document.createElement("strong");
    strong.className = className;
    return strong;
}

// HTMLElement
function createSmallElement(className) {
    const small = document.createElement("small");
    small.className = className;
    return small;
}

// HTMLElement
function createIElement(className) {
    const i = document.createElement("i");
    i.className = className;
    return i;
}

// HTMLElement
function createImgElement(className, src, width, height, title) {
    const img = document.createElement("img");
    img.className = className;
    img.src = src;
    img.width = width;
    img.height = height;
    img.title = title;
    return img;
}

// HTMLElement
function createHElement(level, className, innerText) {
    if (level < 1 || level > 6) {
        throw new Error('Invalid heading level. Should be between 1 and 6.');
    }
    const h = document.createElement("h" + level);
    h.className = className;
    h.innerText = innerText;
    return h;
}

// HTMLElement
function createHrElement(className) {
    const hr = document.createElement("hr");
    hr.className = className;
    return hr;
}

// HTMLElement
function createPElement(className, innerText) {
    const p = document.createElement("p");
    p.className = className;
    p.innerText = innerText;
    return p;
}

// HTMLElement
function createUlElement(className) {
    const ul = document.createElement("ul");
    ul.className = className;
    return ul;
}

// HTMLElement
function createLiElement(className) {
    const li = document.createElement("li");
    li.className = className;
    return li;
}

// HTMLElement
function createFormElement(className) {
    const form = document.createElement("form");
    form.className = className;
    return form;
}

// HTMLElement
function createDivElement(className) {
    const div = document.createElement("div");
    div.className = className;
    //div.id = id;
    return div;
}

// HTMLElement
function createInputElement(type, className, value, id, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.className = className;
    input.value = value;
    input.id = id;
    input.placeholder = placeholder;
    return input;
}

// HTMLElement
function createTextareaElement(className, value, placeholder, rows) {
    const textarea = document.createElement("textarea");
    textarea.className = className;
    textarea.value = value;
    textarea.placeholder = placeholder;
    textarea.rows = rows;
    return textarea;
}

// HTMLElement
function createLabelElement(className, htmlFor, innerText) {
    const label = document.createElement("label");
    label.className = className;
    label.htmlFor = htmlFor;
    label.innerText = innerText;
    return label;
}

// HTMLElement
function createButtonElement(className, type, innerText) {
    const button = document.createElement("button");
    button.className = className;
    button.type = type;
    button.innerText = innerText;
    return button;
}

// clear all nodes under main node
function clearMainContent(main) {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

// clear all nodes under ul node
function clearUlContent(ul) {
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}

// clear all nodes under div node
function clearDivContent(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// custom form validation
function validEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email);
}

// custom form validation
function validName(name) {
    const re = /^[A-Z][a-z]+( [A-Z][a-z]+)?( [A-Z][a-z]+)?$/
    return re.test(name);
}

// custom form validation
function validPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-=+_{}\[\]|;:'",.<>?\\]{8,32}$/
    return re.test(password);
}

// custom form validation
function validConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
}

// custom form validation
function validMessage(text, image) {
    return validText(text) || validImage(image);
}

// custom form validation
function validText(text) {
    return text !== "" && /\S/.test(text);
}

// custom form validation
function validImage(image) {
    return image !== "";
}

// custom form validation
function validMessageEdit(curr, prev, image) {
    return image || (prev !== "" ? curr !== prev : true);
}

// check if the user is logged in
function authenticated() {
    if (getToken() === null) {
        return false;
    }
    return true;
}

// convert iso string into string
function getDate(isoString) {
    const dateObj = new Date(isoString);

    // Format to "Month Day, Year, Hours:Minutes AM/PM"
    return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// get the member object from local storage
function getMember(userId) {
    const channelMembers = JSON.parse(localStorage.getItem('channelMembers'));

    for (let i = 0; i < channelMembers.members.length; i++) {
        if (Number(userId) === Number(channelMembers.members[i].id)) {
            return channelMembers.members[i];
        }
    }

    return null;
}

// count the number of each reactions
function getReactCounts(reacts) {
    let reactCounts = {};

    reactCounts['heart-eyes'] = 0;
    reactCounts['grin'] = 0;
    reactCounts['grimace'] = 0;
    reactCounts['frown'] = 0;
    reactCounts['expressionless'] = 0;
    //reactCounts['dizzy'] = 0;
    //reactCounts['astonished'] = 0;

    reacts.forEach(reactObj => {
        const react = reactObj.react;
        reactCounts[react]++;
    });

    return reactCounts;
}

// determine which of those reactions is reacted by the logged in user
function getReactFlags(reacts) {
    const userId = getUserId();
    let reactFlags = {};

    reactFlags['heart-eyes'] = false;
    reactFlags['grin'] = false;
    reactFlags['grimace'] = false;
    reactFlags['frown'] = false;
    reactFlags['expressionless'] = false;
    //reactFlags['dizzy'] = false;
    //reactFlags['astonished'] = false;

    reacts.forEach(reactObj => {
        const react = reactObj.react;
        const user = reactObj.user;

        if (Number(user) === userId) {
            reactFlags[react] = true;
        }
    });

    return reactFlags;
}

// process for getting the push notifications
function startServerPoll() {
    if (serverPollInterval) {
        clearInterval(serverPollInterval);
    }
    
    serverPollInterval = setInterval(() => {
        const privateChannels = JSON.parse(localStorage.getItem('privateChannels'));
        const publicChannels = JSON.parse(localStorage.getItem('publicChannels'));
        for (let i = 0; i < privateChannels.length; i++) {
            if (privateChannels[i].members.findIndex(member => member === getUserId()) > -1) {
                getMessages(privateChannels[i].id, 0)
                    .then((messages) => {
                        let messageViewed = JSON.parse(localStorage.getItem('messageViewed'));
                        
                        if (!messageViewed) {
                            messageViewed = {};
                            messageViewed[privateChannels[i].id] = 0;
                            localStorage.setItem('messageViewed', JSON.stringify(messageViewed));
                        }
                        if (messages.messages[0]) {
                            let messageViewedId = messageViewed[privateChannels[i].id];
                            if (!messageViewedId) messageViewedId = 0
                            if (Number(messages.messages[0].id) > messageViewedId) {
                                //console.log(privateChannels[i].id);
                                let img = document.getElementById(`channel-${privateChannels[i].id}`);
                                if (img) img.classList.remove("d-none");
                            }
                        }
                    })
                    .catch((errorMessage) => {
                        if (errorMessage !== "Authorised user is not a member of this channel") {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                            clearInterval(serverPollInterval);
                        }
                    });
            }
        }
        for (let i = 0; i < publicChannels.length; i++) {
            if (publicChannels[i].members.findIndex(member => member === getUserId()) > -1) {
                getMessages(publicChannels[i].id, 0)
                    .then((messages) => {
                        let messageViewed = JSON.parse(localStorage.getItem('messageViewed'));
                        if (!messageViewed) {
                            messageViewed = {};
                            messageViewed[publicChannels[i].id] = 0;
                            localStorage.setItem('messageViewed', JSON.stringify(messageViewed));
                        }
                        if (messages.messages[0]) {
                            let messageViewedId = messageViewed[publicChannels[i].id];
                            if (!messageViewedId) messageViewedId = 0
                            if (Number(messages.messages[0].id) > messageViewedId) {
                                let img = document.getElementById(`channel-${publicChannels[i].id}`);
                                if (img) img.classList.remove("d-none");
                            }
                        }
                    })
                    .catch((errorMessage) => {
                        if (errorMessage !== "Authorised user is not a member of this channel") {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                            clearInterval(serverPollInterval);
                        }
                    });
            }
        }
    }, 5000);
}

// stop the push notifications process
function stopServerPoll() {
    clearInterval(serverPollInterval);
}

// process for updating the chat history of the current opened channel
function startChatRefresh(divNode, staticBackdrop, divNotificationBar, profileEditor, imageViewer) {
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
    }

    chatRefreshInterval = setInterval(() => {
        const channelDetails = JSON.parse(localStorage.getItem('channelDetails'));
        const oldChannelMessages = JSON.parse(localStorage.getItem('channelMessages')).messages.reverse();
        const oldChannelMessagesMap = new Map(oldChannelMessages.map(msg => [msg.id, msg]));
        cacheChannelDetails(channelDetails.id)
            .then(() => {
                cacheChannelMembers()
                    .then(() => {
                        cacheChannelMessages(channelDetails.id)
                            .then(() => {
                                const newChannelMessages = JSON.parse(localStorage.getItem('channelMessages')).messages.reverse();
                                const newChannelMessagesMap = new Map(newChannelMessages.map(msg => [msg.id, msg]));
                                const newMessages = [];
                                const deletedMessages = [];
                                const updatedMessages = [];

                                newChannelMessages.forEach(newMsg => {
                                    const oldMsg = oldChannelMessagesMap.get(newMsg.id);
                                    if (!oldMsg) newMessages.push(newMsg);
                                });

                                oldChannelMessages.forEach(oldMsg => {
                                    const newMsg = newChannelMessagesMap.get(oldMsg.id);
                                    if (!newMsg) deletedMessages.push(oldMsg);
                                });

                                newChannelMessages.forEach(newMsg => {
                                    const oldMsg = oldChannelMessagesMap.get(newMsg.id);
                                    if (oldMsg) {
                                        if (areDifferent(oldMsg, newMsg)) updatedMessages.push(newMsg);
                                    }
                                });

                                for (let i = 0; i < newMessages.length; i++) {
                                    // TEST
                                    let messageViewed = JSON.parse(localStorage.getItem('messageViewed'));
                                    if (!messageViewed) messageViewed = {};
                                    messageViewed[channelDetails.id] = newMessages[i].id;
                                    localStorage.setItem('messageViewed', JSON.stringify(messageViewed));
                                
                                    appendMessageEntry(divNode, newMessages[i], staticBackdrop, profileEditor, imageViewer);
                                }

                                for (let i = 0; i < deletedMessages.length; i++) {
                                    let messageEntry = divNode.querySelector(`[id="${deletedMessages[i].id}"]`);
                                    if (messageEntry) {
                                        clearDivContent(messageEntry);
                                        messageEntry.remove();
                                    }
                                }

                                for (let i = 0; i < updatedMessages.length; i++) {
                                    let messageEntry = divNode.querySelector(`[id="${updatedMessages[i].id}"]`);
                                    updateMessageEntry(messageEntry, updatedMessages[i], staticBackdrop, profileEditor, imageViewer);
                                }
                            })
                            .catch((errorMessage) => {
                                if (errorMessage === "TypeError: Failed to fetch") {
                                    divNotificationBar.innerText = "You are disconnected. Offline Mode is enabled.";
                                    divNotificationBar.classList.remove("d-none");
                                } else {
                                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                                }
                                clearInterval(chatRefreshInterval);
                            });
                    })
                    .catch((errorMessage) => {
                        if (errorMessage === "TypeError: Failed to fetch") {
                            divNotificationBar.innerText = "You are disconnected. Offline Mode is enabled.";
                            divNotificationBar.classList.remove("d-none");
                        } else {
                            displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                        }
                        clearInterval(chatRefreshInterval);
                    });
            })
            .catch((errorMessage) => {
                if (errorMessage === "TypeError: Failed to fetch") {
                    divNotificationBar.innerText = "You are disconnected. Offline Mode is enabled.";
                    divNotificationBar.classList.remove("d-none");
                } else {
                    displayModalStaticBackdrop(staticBackdrop, "Error", errorMessage);
                }
                clearInterval(chatRefreshInterval);
            });
    }, 3000);
}

// stop the chat history updating process
function stopChatRefresh() {
    clearInterval(chatRefreshInterval);
}

// compare if two messages are different
function areDifferent(oldMsg, newMsg) {
    if (oldMsg.message !== newMsg.message) return true;
    if (oldMsg.image !== newMsg.image) return true;
    if (oldMsg.sender !== newMsg.sender) return true;
    if (oldMsg.sentAt !== newMsg.sentAt) return true;
    if (oldMsg.edited !== newMsg.edited) return true;
    if (oldMsg.editedAt !== newMsg.editedAt) return true;
    if (oldMsg.pinned !== newMsg.pinned) return true;

    // Compare reacts
    if (oldMsg.reacts.length !== newMsg.reacts.length) return true;

    for (let i = 0; i < oldMsg.reacts.length; i++) {
        if (oldMsg.reacts[i].react !== newMsg.reacts[i].react) return true;
        if (oldMsg.reacts[i].user !== newMsg.reacts[i].user) return true;
    }

    return false;
}

// get token from either local storage or session storage
function getToken() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token;
}

// get the user id from either local storage or session storage
function getUserId() {
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    return Number(userId);
}

// get the pinned messages from cached chat history
function getPinnedMessages() {
    const channelMessages = JSON.parse(localStorage.getItem('channelMessages')).messages;
    const pinnedMessages = []
    for (let i = 0; i < channelMessages.length; i++) {
        if (channelMessages[i].pinned) pinnedMessages.push(channelMessages[i]);
    }
    return pinnedMessages;
}

function login(email, password) {
    return apiCallPost('auth/login', {
        email: email,
        password: password
    }, authenticated());
}

function register(email, password, name) {
    return apiCallPost('auth/register', {
        email: email,
        password: password,
        name: name
    }, authenticated());
}

function createChannel(name, privateFlag, description) {
    return apiCallPost('channel', {
        name: name,
        private: privateFlag,
        description: description
    }, authenticated());
}

function updateChannel(channelId, name, description) {
    return apiCallPut(`channel/${channelId}`, {
        name: name,
        description: description
    }, authenticated());
}

function joinChannel(channelId) {
    return apiCallPost(`channel/${channelId}/join`, {}, authenticated());
}

function leaveChannel(channelId) {
    return apiCallPost(`channel/${channelId}/leave`, {}, authenticated());
}

function inviteChannel(channelId, userId) {
    return apiCallPost(`channel/${channelId}/invite`, {
        userId: userId
    }, authenticated());
}

function getChannel(channelId) {
    return apiCallGet(`channel/${channelId}`, authenticated);
}

function getMessages(channelId, start) {
    return apiCallGet(`message/${channelId}?start=${start}`, {}, authenticated);
}

function sendMessage(channelId, message, image) {
    if (!image) {
        return apiCallPost(`message/${channelId}`, {
            message: message,
        }, authenticated());
    } else {
        return apiCallPost(`message/${channelId}`, {
            message: message,
            image: image
        }, authenticated());
    }
}

function updateMessage(channelId, messageId, message, image) {
    if (!image) {
        return apiCallPut(`message/${channelId}/${messageId}`, {
            message: message,
        }, authenticated());
    } else {
        return apiCallPut(`message/${channelId}/${messageId}`, {
            message: message,
            image: image
        }, authenticated());
    }
}

function reactMessage(channelId, messageId, react) {
    return apiCallPost(`message/react/${channelId}/${messageId}`, {
        react: react
    }, authenticated);
}

function unreactMessage(channelId, messageId, react) {
    return apiCallPost(`message/unreact/${channelId}/${messageId}`, {
        react: react
    }, authenticated);
}

function pinMessage(channelId, messageId) {
    return apiCallPost(`message/pin/${channelId}/${messageId}`, {}, authenticated);
}

function unpinMessage(channelId, messageId) {
    return apiCallPost(`message/unpin/${channelId}/${messageId}`, {}, authenticated);
}

function deleteMessage(channelId, messageId) {
    return apiCallDelete(`message/${channelId}/${messageId}`, authenticated());
}

function logout() {
    return apiCallPost('auth/logout', {}, authenticated());
}

function getUser(userId) {
    return apiCallGet(`user/${userId}`, authenticated());
}

function getUsers() {
    return apiCallGet('user', authenticated());
}

function updateProfile(email, password, name, bio, image) {
    let payload = null;
    if (!image) {
        payload = {
            email: email,
            password: password,
            name: name,
            bio: bio
        }
    } else {
        payload = {
            email: email,
            password: password,
            name: name,
            bio: bio,
            image: image
        }

    }
    return apiCallPut('user', payload, authenticated());
}

function getChannels() {
    return apiCallGet('channel', authenticated());
}

function getAllPublicChannels(data) {
    const publicChannels = data.channels.filter(channel => !channel.private);
    return publicChannels;
}

function getJoinedPrivateChannels(data, userId) {
    const privateChannels = data.channels.filter(channel =>
        channel.private && channel.members.includes(userId)
    );
    return privateChannels;
}

function getEditedDate(messageId) {
    const channelMessages = JSON.parse(localStorage.getItem('channelMessages'));
    for (let i = 0; i < channelMessages.length; i++) {
        if (Number(channelMessages[i].id) === Number(messageId)) {
            return getDate(channelMessages[i].editedAt);
        }
    }
    return null;
}

// API call POST
const apiCallPost = (path, body, authed) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authed ? `Bearer ${getToken()}` : undefined
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            })
            .catch(() => {
                reject("Slackr's server is currently offline. Try again later.");
            });
    });
}

// API call PUT
const apiCallPut = (path, body, authed) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authed ? `Bearer ${getToken()}` : undefined
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            })
            .catch(() => {
                reject("Slackr's server is currently offline. Try again later.");
            });
    });
}

// API call DELETE
const apiCallDelete = (path, authed) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authed ? `Bearer ${getToken()}` : undefined
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            })
            .catch(() => {
                reject("Slackr's server is currently offline. Try again later.");
            });
    });
}

// API call GET
const apiCallGet = (path, authed) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authed ? `Bearer ${getToken()}` : undefined
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            })
            .catch(() => {
                reject("TypeError: Failed to fetch");
            })
    });
}

// MAIN
document.addEventListener("DOMContentLoaded", function () {
    const main = document.getElementById("main");
    const body = document.getElementById("body");

    const staticBackdrop = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    if (!authenticated()) {
        displayFormSignin(main, body, staticBackdrop);
    } else {
        displayChannelAtMe(main, body, staticBackdrop);
    }
});
