const fetchAllRatings = async (id) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            employeeId: id
        })
    };
    try {
        let fetchedData = await fetch('/fetch-ratings', options);
        return fetchedData.json(); 
    } catch (err) {
        return {'message': `Error Occured while fetching reviews from mongoDB (This is client side) (err = ${err} )`};
    }
}

const renderRatings = (async() =>{
    const id = document.querySelector('.past-ratings').id;
    const fetchedRatings = await fetchAllRatings(id);
    if(Object.keys(fetchedRatings).length == 0){
        document.querySelector('.past-ratings').innerHTML = 
        `
            <div class="employee-review">
                <p>NO REVIEWS YET</p>
                <span> 🗨️ </span>
            </div>
        `;
        return;
    }
    document.querySelector('.past-ratings').innerHTML = "";
    const keys = Object.keys(fetchedRatings).forEach(key => {
        document.querySelector('.past-ratings').innerHTML += 
        `
            <div class="employee-review">
                <p>${fetchedRatings[key]}</p>
                <span> 🗨️ ${key} </span>
            </div>
        `
    })
})();