const category = document.getElementById("category");
const search = document.getElementById("search");
const results = document.getElementById("results");
const books = document.getElementById("books");
const progressBar = document.getElementById("progress-bar");
const mainProgress = document.getElementById("main-progress");

let button;
let Alldescription;
let description;
let data;
let cardBody;
let xhr = new XMLHttpRequest();
let url;


mainProgress.style.display= 'none';

let deleteAllCards = function() {
    //Delete all the previous cards
    let cardsColl = document.querySelectorAll(".carta");
    if(cardsColl.length) {
        cardsColl.forEach(function(card) {
            card.remove();
        })
    }

    //Delete all the previous descriptions
    let descriptionColl = document.querySelectorAll(".description-body");
    if(descriptionColl.length) {
        descriptionColl.forEach(function(des) {
            des.remove();
        })
    }

    //Delete Button Close
    let close = document.querySelectorAll(".btn-close");
    if(close.length) {
        close.forEach(function(cl) {
            cl.remove();
        })
    }
}

let buttonClose = function() {    
    button = document.createElement("button");
    button.className = "btn-close";
    button.setAttribute("aria-label", "Close");
    Alldescription.appendChild(button);
} 

let removePreviousDescription = function() {
    button.addEventListener("click", function() {
        let remove = document.querySelectorAll(".all-description");
        if(remove.length) {
            remove.forEach(function(rem) {
            rem.remove();
        })
        }
    });
}

let removeDescriptionIfVisibile= function() {  
    let remove = document.querySelectorAll(".all-description");
    if(remove.length) {
        remove.forEach(function(rem) {
        rem.remove();
        })
    }
}

let getProgress = function (url) {
    xhr.addEventListener('progress', loading);
    xhr.open('GET', url);
    xhr.send();
}

let createCard = async function(book) {
    const divMain = document.createElement("div");
    divMain.className = "carta"
    books.appendChild(divMain);

    cardBody = document.createElement("a");
    cardBody.className = "carta-body"
    divMain.appendChild(cardBody);
    cardBody.innerHTML = book.title; 
}

let createDescription = function(data2) {
    description = document.createElement("div");
    description.className = "description-body"
                                            
    if(data2.description && !data2.description.value)
        description.innerHTML = data2.description;
    else if(data2.description && data2.description.value)
        description.innerHTML = data2.description.value;
    else
        description.innerHTML = "Descrizione non disponibile";
}

let onClear = function(){
    buttonClose();
    removePreviousDescription(); 
}

let handleChange = async function(event, book) {
    const url2 = "https://openlibrary.org" + book.key + ".json";
    try {                          
        const response2 = await fetch(url2)
        if (response2.ok) {
            const data2 = await response2.json();
            Alldescription = document.createElement("div");
            Alldescription.className = "all-description"
            onClear();               
            createDescription(data2);
            removeDescriptionIfVisibile();
            books.insertBefore(Alldescription, event.target.parentNode.nextSibling);
            Alldescription.appendChild(description);              
        } else {
            alert("Errore: " + response2.status);
        }            
    }
    catch(e) {
        alert(e);
    }         
}

//View Loading Bar
let loading = async function(event) {

    mainProgress.style.display= 'block';
    if(event.lenghtComputable) {
        
        let percentComplete = (event.loaded / event.total) * 100;
        switch (percentComplete) {
            case 25: progressBar.className="progress-bar w-"+25;
            break;
            case 50: progressBar.className="progress-bar w-"+50;
            break;
            case 75: progressBar.className="progress-bar w-"+75;
            break;
            case 100: progressBar.className="progress-bar w-"+100;
            break;
        }
    }
    else
    {
        let count = 0;
        setInterval(() => {    
            progressBar.className="progress-bar w-"+count;
            count+= 25;

            if(count > 100) {
                count = 0
            }
        }, 300);
    }
}

search.addEventListener("click", function() {

   deleteAllCards();
   const value = category.value.toLowerCase().replace(/[^A-Z0-9]+/ig, "_");
   if(value) {
    
        url = "https://openlibrary.org/subjects/" + value + ".json";
        getProgress(url);
        axios.get(url)
       .then(async function(response) {
       
        data = response.data;
        if (data.works && data.works.length > 0) {
            results.innerHTML= "Risultati per: " +"\"" + value +"\"";
            category.value = "";

            for (let book of data.works) {
                await createCard(book)
                cardBody.addEventListener('click', (event) => handleChange(event,book));
            } 
            mainProgress.style.display= 'none';
        }
        else {
            results.innerHTML= "Nessun libro trovato per la categoria: " + value;
        }
        })
        .catch (function(error) {
            alert("Impossibile recuperare i dati: " + error.message);
        })
    }
}) 