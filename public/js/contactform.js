
const doc =document.getElementById("contact-form");

doc.onsubmit = () => {
    let isValid = true;
    ResetErrors();

    let invalidFields = [] // this is populated with the string id in the html of the error span indicator
    let inputs = {}; // this is a kvp object containing input values from the html
    
    let fname =     document.getElementById("f-name").value.trim();
    let lname =     document.getElementById("l-name").value.trim();
    let job =       document.getElementById("job").value.trim();
    let company =   document.getElementById("company").value.trim();
    let linkedIn =  document.getElementById("linkedin").value.trim();
    let email =     document.getElementById("email").value.trim();
    let otherMet =  document.getElementById("other-met").value.trim();
    let met =       document.getElementById("met-select");
    let radioHtml = document.getElementById("html");
    let radioText = document.getElementById("text");
    
    inputs['err-fname'] =   fname;
    inputs['err-lname'] =   lname;
    inputs['err-job'] =     job;
    inputs['err-company']=  company;
    inputs['err-linkedIn']= linkedIn;
    inputs['err-email'] =   email;

    //if and of the input values are invalid this loop adds the key to the invalid list
    for(var key of Object.keys(inputs)){
        if(!inputs[key]){
            invalidFields.push(key)
        }
    }

    //this if checks if there is a value for wither the other input or the select
    if(met.value == "none" && !otherMet ){
        invalidFields.push("err-met");
        invalidFields.push("err-met-other");
    }
    // verifies if a format radio was selected
    if(!radioHtml.checked && !radioText.checked){
        invalidFields.push("err-format");
    }
    

    // loops over "invalid fields" if any exist and sets there spans
    // to visable/block and returns false from the submit function
    if(invalidFields.length > 0){
        isValid = false

        for(var errID of invalidFields){
            document.getElementById(errID).style.display = 'block';
        }
    }

    return isValid;
}

//reset all error displays to none
function ResetErrors(){
    errorTexts = document.getElementsByClassName("err");
    for(var e of errorTexts){
        e.style.display='none';
    }
}