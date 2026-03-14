export function validateForm(data){
    let isValid = true;
    let errors = [];

    if(data.fname[1] == ""){
        errors.push("First name required");
        isValid = false;
    }
    if(data.lname[1] == ""){
        errors.push("Last name required");
        isValid = false;
    }
    if(data.email[1] == ""){
        errors.push("email required");
        isValid = false;
    }
    if(data.metSelect[1].trim() == ''){
        errors.push("how we met is required");
        isValid = false;
    }
    if(data.mailList[1] == "yes" && data.format[1] == ''){
        errors.push("Mailing format required for mailing list");
        isValid = false;
    }
    
    return {isValid, errors};
}