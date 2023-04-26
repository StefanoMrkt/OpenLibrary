const category = document.getElementById("category");
const search = document.getElementById("search");
const results = document.getElementById("results");
const books = document.getElementById("books");

let button;

search.addEventListener("click", function() {


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

    const value = category.value;

    if(value) {
        const url = "https://openlibrary.org/subjects/" + value + ".json";
        axios
        .get(url)
        .then(function(response) {
            const data = response.data;

            if (data.works && data.works.length > 0) {

                results.innerHTML= "Risultati per: " + value;
                category.value = "";


                for (let book of data.works) {

                    const divMain = document.createElement("div");
                    divMain.className = "carta"
                    books.appendChild(divMain);

                    const cardBody = document.createElement("a");
                    cardBody.className = "carta-body"
                    divMain.appendChild(cardBody);
                    cardBody.innerHTML = book.title;

                    async function handleChange(event) {

                        const url2 = "https://openlibrary.org" + book.key + ".json";
                        try {                          
                            const response2 = await fetch(url2)
                                if (response2.ok) {

                                    const data2= await response2.json();
    
                                    const Alldescription = document.createElement("div");
                                    Alldescription.className = "all-description"

                                    //Add 'X' button to close description
                                    button = document.createElement("button");
                                    button.className = "btn-close";
                                    button.setAttribute("aria-label", "Close");
                                    Alldescription.appendChild(button);

                                    button.addEventListener("click", function() {
                                        let remove = document.querySelectorAll(".all-description");
                                        if(remove.length) {
                                            remove.forEach(function(rem) {
                                            rem.remove();
                                        })
                                        }
                                    });
                                            
                                    const description = document.createElement("div");
                                    description.className = "description-body"

                                    if(data2.description)
                                        description.innerHTML = data2.description;
                                    else
                                        description.innerHTML = "Descrizione non disponibile";

                                    //Delete previous same description if visible
                                    let remove = document.querySelectorAll(".all-description");
                                    if(remove.length) {
                                        remove.forEach(function(rem) {
                                        rem.remove();
                                    })
                                    }

                                    books.insertBefore (Alldescription, event.target.parentNode.nextSibling);
                                    Alldescription.appendChild(description);              

                                } else {
                                    alert("Errore: " + response2.status);
                                }            
                        }
                        catch(e) {
                            alert(e);
                        }         
                    }

                    cardBody.addEventListener('click', handleChange);
                } 
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