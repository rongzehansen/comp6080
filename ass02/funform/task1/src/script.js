document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementsByTagName("form")[0];

    const streetNameInput = document.getElementById("street-name");
    const suburbInput = document.getElementById("suburb");
    const postcodeInput = document.getElementById("postcode");
    const dobInput = document.getElementById("dob");
    const buildingTypeSelect = document.getElementById("building-type");
    const featureInputs = document.getElementsByName("features");
    const selectAllButton = document.getElementById("select-all-btn");
    const resetFormButton = document.getElementById("reset-form");
    
    const formResult = document.getElementById("form-result");

    const inputs = [streetNameInput, suburbInput, postcodeInput, dobInput];

    inputs.forEach(input => {
        input.addEventListener("blur", function() {
            render(formResult, streetNameInput.value, suburbInput.value, postcodeInput.value, dobInput.value, buildingTypeSelect.value, featureInputs);
        });
    });
    
    buildingTypeSelect.addEventListener("change", function() {
        render(formResult, streetNameInput.value, suburbInput.value, postcodeInput.value, dobInput.value, buildingTypeSelect.value, featureInputs);
    });
    
    featureInputs.forEach(featureInput => {
        featureInput.addEventListener("change", function() {
            changeButton(featureInputs, selectAllButton);
            render(formResult, streetNameInput.value, suburbInput.value, postcodeInput.value, dobInput.value, buildingTypeSelect.value, featureInputs);
        });
    });
    
    selectAllButton.addEventListener("click", function() {
        if (selectAllButton.value == "Select All") {
            selectAll(featureInputs);
        }
        else {
            deselectAll(featureInputs);
        }
        changeButton(featureInputs, selectAllButton);
        render(formResult, streetNameInput.value, suburbInput.value, postcodeInput.value, dobInput.value, buildingTypeSelect.value, featureInputs);
    });
    
    resetFormButton.addEventListener("click", function() {
        form.reset();
        changeButton(featureInputs, selectAllButton)
    });
});

function validStreetName(streetName) {
    streetName = streetName.trim();
    if (streetName.length >= 3 && streetName.length <= 50) {
        return true;
    }
    return false;
}

function validSuburb(suburb) {
    suburb = suburb.trim();
    if (suburb.length >= 3 && suburb.length <= 50) {
        return true;
    }
    return false;
}

function validPostcode(postcode) {
    const re = /^\s*[0-9]{4}\s*$/;
    return re.test(postcode);
}

function validDOB(dob) {
    const re = /^\s*[0-9]{2}\/[0-9]{2}\/[0-9]{4}\s*$/;
    if (re.test(dob)) {
        const input = dob.match(re)[0].trim();
        const parts = input.split('/');
        const datetime = parts.reverse().join('-');
        if (Date.parse(datetime)) {
            return true;
        }
        return false;
    }
    return false;
}

function getAge(dob) {
    const [day, month, year] = dob.split("/").map(Number);
    
    const datetime = new Date(year, month - 1, day);
    const today = new Date();
    
    let age = today.getFullYear() - datetime.getFullYear();
    const m = today.getMonth() - datetime.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < datetime.getDate())) {
        age--;
    }
    return age;
}

function getFeatures(featureInputs) {
    const features = [];
    for (let i = 0; i < featureInputs.length; i++) {
        if (featureInputs[i].checked) {
            features.push(featureInputs[i].value);
        }
    }
    const nFeatures = features.length;
    switch (nFeatures) {
        case 0:
            return 'no features';
        case 1:
            return features[0];
        case 2:
            return `${features[0]} and ${features[1]}`;
        default:
            return `${features.slice(0, nFeatures - 1).join(', ')}, and ${features[nFeatures - 1]}`;
    }
}

function selectAll(featureInputs) {
    for (let i = 0; i < featureInputs.length; i++) {
        featureInputs[i].checked = true;
    }
}

function deselectAll(featureInputs) {
    for (let i = 0; i < featureInputs.length; i++) {
        featureInputs[i].checked = false;
    }
}

function changeButton(featureInputs, selectAllButton) {
    for (let i = 0; i < featureInputs.length; i++) {
        if (featureInputs[i].checked == false) {
            selectAllButton.value = "Select All"
            return;
        }
    }
    selectAllButton.value = "Deselect all"
}

function render(formResult, rawStreetName, rawSuburb, rawPostcode, rawDob, buildingType, featureInputs) {
    if (!validStreetName(rawStreetName)) {
        formResult.value = "Please input a valid street name";
    }
    else if (!validSuburb(rawSuburb) && validStreetName(rawStreetName)) {
        formResult.value = "Please input a valid suburb";
    }
    else if (!validPostcode(rawPostcode) && validStreetName(rawStreetName) && validSuburb(rawSuburb)) {
        formResult.value = "Please input a valid postcode";
    }
    else if (!validDOB(rawDob) && validStreetName(rawStreetName) && validSuburb(rawSuburb) && validPostcode(rawPostcode)) {
        formResult.value = "Please enter a valid date of birth";
    }
    else {
        const streetName = rawStreetName.trim();
        const suburb = rawSuburb.trim();
        const postcode = rawPostcode.trim();
        const dob = rawDob.trim();
        const age = getAge(dob);
        
        const features = getFeatures(featureInputs);
        if (buildingType == "apartment") {
            formResult.value = `You are ${age} years old, and your address is ${streetName} St, ${suburb}, ${postcode}, Australia. Your building is an Apartment, and it has ${features}`;
        }
        else {
            formResult.value = `You are ${age} years old, and your address is ${streetName} St, ${suburb}, ${postcode}, Australia. Your building is a House, and it has ${features}`;
        }
    }
}
