let currentMG = {} //keeps track of mg consumed in that specific time interval
let allUpdates = [];
let dataStructurePrepared = {};
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBNhQMH700fEAMJorLNnRC1rt6ZzsXKANE",
    authDomain: "pearlhacks2021.firebaseapp.com",
    databaseURL: "https://pearlhacks2021-default-rtdb.firebaseio.com",
    projectId: "pearlhacks2021",
    storageBucket: "pearlhacks2021.appspot.com",
    messagingSenderId: "854320378400",
    appId: "1:854320378400:web:91804ed44c32dd00144245",
    measurementId: "G-3VBLN26ZYR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  let dbRef1 = firebase.database().ref().child('pearlHacks_tabLetTab').child('Medication');
  dbRef1.on('value', snap => prepToUpdateMap("Medication", snap.val()));

  let dbRef2 = firebase.database().ref().child('pearlHacks_tabLetTab').child('Pain Impulse');
  dbRef2.on('value', snap => prepToUpdateMap("Pain Impulse", snap.val()));

  let dbRef3 = firebase.database().ref().child('pearlHacks_tabLetTab').child('Pain Intensity');
  dbRef3.on('value', snap => prepToUpdateMap("Pain Intensity", snap.val()));

  let dbRef4 = firebase.database().ref().child('pearlHacks_tabLetTab').child('Pill Dispensed');
  dbRef4.on('value', snap => prepToUpdateMap("Pill Dispensed", snap.val()));

  let dbRef5 = firebase.database().ref().child('pearlHacks_tabLetTab').child('Quantity Consumed');
  dbRef5.on('value', snap => prepToUpdateMap("Quantity Consumed", snap.val()));

  let thingsToKeepTrackOf=5;

  firstMapInitialization();

setInterval(function(){ //update currentMG every hour
  
    
        Object.keys(ingredientDosages).forEach(individualIngredient => {
            currentMG[individualIngredient].hoursLeftUntilResetInterval-=1;
            if(currentMG[individualIngredient].hoursLeftUntilResetInterval===0){
                console.log("resetting hour");
                currentMG[individualIngredient].hoursLeftUntilResetInterval = ingredientDosages[individualIngredient].interval;
                currentMG[individualIngredient].amtInInterval=0;
            }
        });
    
  },3600000)
  //60000

  setInterval(function(){ //update currentMG every day
  
   
        Object.keys(ingredientDosages).forEach(individualIngredient => {
            console.log("resetting day");
            currentMG[individualIngredient].amtDaily=0;
        });
    
  }, 3600000*24)

function firstMapInitialization(){

    Object.keys(ingredientDosages).forEach(individualIngredient => {
        currentMG[individualIngredient]={amtInInterval: 0 , amtDaily : 0, hoursLeftUntilResetInterval : ingredientDosages[individualIngredient].interval};
    });
}
function prepToUpdateMap(name, value){
    if(value!=="Default"){
        dataStructurePrepared[name] = value;
        console.log(name + " ", value);
        if(Object.keys(dataStructurePrepared).length===thingsToKeepTrackOf){
            userSentData();
        }

    }
    
}
function userSentData(drugTaken, dosageMG) {
    let tempDataStruct = dataStructurePrepared;
    dataStructurePrepared = {}; //clear values
    const currDate = new Date();
    let newObj = {};
    newObj["timestamp"]= currDate.getTime();

    Object.keys(tempDataStruct).forEach(key =>{
        newObj[key] = tempDataStruct[key];
    });

    allUpdates.push(newObj);
    analyzeData(newObj);

}

function analyzeData(myUpdate){
    let drugTaken = myUpdate["Medication"];
    let ingredients = drugsAndIngredients[drugTaken.toLowerCase()]; //returns object returning active ingredients in the drug along with respective concentrations
    //update currentMG
    
    Object.keys(ingredients).forEach(individualIngredient => {
        currentMG[individualIngredient].amtInInterval+= myUpdate["Quantity Consumed"]*ingredients[individualIngredient];
        currentMG[individualIngredient].amtDaily+= myUpdate["Quantity Consumed"]*ingredients[individualIngredient];

        let allowedInterval = areCurrentAmountsOkayInterval(individualIngredient);
        let allowedDaily = areCurrentAmountsOkayDaily(individualIngredient);

        if(allowedDaily === true && allowedInterval===true){
            //SEND MESSAGE BACK, OKAY TO DISPENSE
        }
        else{
            //NOT OKAY TO DISPENSE, DO NOT DISPENSE
        }
    });
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

function sendDataToDisplayWeb(){ //called when webpage is loaded
    return currentMG;
}



 