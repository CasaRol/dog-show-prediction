import './App.css';
import { useEffect, useState } from 'react'
//import findCompetitors from './scraper/scrapeScript.js'
//import Dog from './dogCard/Dog'
import axios from 'axios'
const cheerio = require('cheerio')

function App() {

  const [doRun, setRun] = useState(false);
  const [allDogs, setAllDogs] = useState([]);

  const TIME_INTERVAL = 5000

  useEffect(() => {
    if (doRun) {
      console.log("Timer started...")
      const interval = setInterval(() => {
        //call scaper
        //console.log("TIME INTERVAL REACHED!")
        //setAllDogs(findCompetitors())
        axios("http://127.0.0.1:5500/index.html")
          .then(response => {
            let counter = 0
            const tmpAllDogs = []
            const html = response.data
            const cheer = cheerio.load(html)
            const regexPattern = /[0-9]{2}.[0-9]{2}.[0-9]{4}/ //Looks for a date format including leading zeros (dd.mm.yyy)
            cheer('p').each(function () {
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
            //console.log(tmpAllDogs.length)
            console.log(tmpAllDogs)

            console.log("validate type of tmpAllDogs: " + Array.isArray(tmpAllDogs))
            console.log("validate type of allDogs: " + Array.isArray(allDogs))
            console.log(typeof allDogs)
            setAllDogs(tmpAllDogs)
          })
        console.log("allDogs")
        console.log(allDogs)
      }, TIME_INTERVAL)

      return () => clearInterval(interval);
    }
  }, [doRun, allDogs])

  return (
    <div >
      <h1>HINT: Look in console for update on time interval</h1>
      <button onClick={() => {
        setRun(!doRun)
        console.log("doRun-State has been set to " + !doRun)
      }}>Start runtime</button>

      {
        allDogs.length > 0 && allDogs.array((index, dog) => (
          <div className="dog-card" >
            <h3>${index} -  ${dog.catalogueNumb}</h3>
            <p>Status: ${dog.status}</p>
          </div>
        ))
      }

    </div>
  );
}

export default App;