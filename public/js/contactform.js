
const doc =document.getElementById("contact-form");
let MailListToggle = document.getElementById("mail-list");
let formatOptions = document.getElementById("format-div");


 doc.onsubmit = () => {

    let fname =     document.getElementById("f-name").value.trim();
    let lname =     document.getElementById("l-name").value.trim();
    let otherMet =  document.getElementById("other-met").value.trim();
    let email =     document.getElementById("email").value.trim();
    let linkedIn =  document.getElementById("linkedin").value.trim();
    let met =       document.getElementById("met-select");
    let radioHtml = document.getElementById("html");
    let radioText = document.getElementById("text");


    let isValid = true;
    ResetErrors();
    
    let invalidFields = [] // this is populated with the string id in the html of the error span indicator

    if(!fname){invalidFields.push("err-fname");}
    if(!lname){invalidFields.push("err-lname");}

    //this if checks if there is a value for wither the other input or the select
    if(!met.value && !otherMet ){
        invalidFields.push("err-met");
        invalidFields.push("err-met-other");
    }
    //reuires email if add to mailing list is toggled
    if(MailListToggle.checked){
        if(!email){
            invalidFields.push("err-email");
        }
        // verifies if a format radio was selected
        if(!radioHtml.checked && !radioText.checked){
            invalidFields.push("err-format");
        }
    }
    // validates linked in format if one is provided
    if(linkedIn){
        if(!linkedIn.includes("https://linkedin.com/in/")){
            invalidFields.push("err-linkedIn");
        }
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

// adds a listener to email check that toggles visability of format options toggles.
// resets format toggles, and email errror display, if mailing list is toggled off of 
MailListToggle.addEventListener('change', (e) => {
    if(e.target.checked) {
        formatOptions.style.display = "flex";
    } 
    else {
        
        let radioHtml = document.getElementById("html");
        let radioText = document.getElementById("text");

        formatOptions.style.display = "none";
        document.getElementById('err-format').style.display = 'none';
        document.getElementById("err-email").style.display = 'none';
        radioHtml.checked = false
        radioText.checked = false
    }
});
