import axios from 'axios'
const cheerio = require('cheerio')

//axios("https://www.hundeweb.dk/udstilling-katalog/udstilling/220398/search?raid=RING1")
const findCompetitors = axios("http://127.0.0.1:5500/index.html")
    .then(response => {
        let counter = 0
        const tmpAllDogs = []
        const html = response.data
        const cheer = cheerio.load(html)
        const regexPattern = /[0-9]{2}.[0-9]{2}.[0-9]{4}/ //Looks for a date format including leading zeros (dd.mm.yyy)
        cheer('p').each(function() {
            const dog = {
                catalogueNumb: "",
                critique: ""
            }
            if (cheer(this).text().match(regexPattern)) {
                counter += 1

                dog.catalogueNumb = cheer(this).find('p > a').attr('data-dog-id')
                if (cheer(this).find('.Kritikk').text()) {
                    dog.critique = cheer(this).find('.Kritikk').text()
                } else if (cheer(this).text().includes("Ikke mødt")) {
                    dog.critique = "Ikke mødt"
                }
            }

            //Final step: Add to array of dogs
            if (dog.catalogueNumb !== "" && dog.critique !== "") {
                tmpAllDogs.push(dog)
            }

        })

        console.log("counter: " + counter)
        return tmpAllDogs
    })

export default findCompetitors

/*

- Tjek 1 gang pr minut

- sammenlign nuværende liste med ny liste
    - Må være muligt at tjekke dif frem for liste traverse
    
- converter timestamp til tidsdif i hele minutter
    - nuværende tid minus foregående tid
    - sættes på nuværende som bedømmelsestid
    
- React skal have en state med gennemsnitslige bedømmelsestid
    - opdateres hvert minut sammen med den nye liste

*/