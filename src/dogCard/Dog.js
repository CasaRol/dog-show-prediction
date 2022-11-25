import './DogCard.css'

const Dog = (index, dogId, status) => {

    console.log("Dog called!")
    console.log(dogId, status)
    return (
        <div className="dog-card" >
            <h3>${index} -  ${dogId}</h3>
            <p>Status: ${status}</p>
        </div>
    )
}

export default Dog