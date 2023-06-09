import { app } from './firebase.js'
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js"

// == Setup Code ==
const database = getDatabase(app)
const dbRef = ref(database)

// == GET THE ANIMAL DATA ==
// onValue method creates a promise for control flow!
onValue(dbRef, (data) => {
    // put animals into an array
    const allPlants = []
   
    if(data.exists()){
        const payload = data.val().plants;
        for (let plant in payload){
          allPlants.push(payload[plants]);
        }
}})