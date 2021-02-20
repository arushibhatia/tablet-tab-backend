let currentMG = {} //keeps track of mg consumed in that specific time interval

function firstMapInitialization(){
    Object.keys(ingredientDosages).forEach(individualIngredient => {
        currentMG[individualIngredient]={amtInInterval: 0 ,amtDaily : 0};
    });
}

function updateMap(drugTaken, dosageMG) {
    let ingredients = drugsAndIngredients[drugTaken.toLower()]; //returns object returning active ingredients in the drug along with respective concentrations
    //update currentMG
    
    Object.keys(ingredients).forEach(individualIngredient => {
        currentMG[individualIngredient].amtInInterval+= dosageMG*ingredients[individualIngredient];
        currentMG[individualIngredient].amtDaily+= dosageMG*ingredients[individualIngredient];

        let allowedInterval = areCurrentAmountsOkayInterval(individualIngredient);
        let allowedDaily = areCurrentAmountsOkayDaily(individualIngredient);
    })







}

function areCurrentAmountsOkayInterval(ingredientToCheck){
    //check if amt in this interval is okay
    if(currentMG[ingredientToCheck.amtInInterval]> (ingredientDosages[ingredientToCheck].doseSizePerInterval*ingredientDosages[ingredientToCheck].dosesPerInterval)){
        return false;
    }
    return true;
}

function areCurrentAmountsOkayDaily(ingredientToCheck){
    //check if amt in this interval is okay
    if(currentMG[ingredientToCheck.amtDaily]> (ingredientDosages[ingredientToCheck].maximumDaily)){
        return false;
    }
    return true;
}