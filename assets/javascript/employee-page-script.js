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
const fetchPendingRatings = async (id) => {
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
        let fetchedData = await fetch('/fetch-pending-ratings', options);
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

const renderPendingRatings = (async() => {
    const id = document.querySelector('.past-ratings').id;
    const fetchedRatings = await fetchPendingRatings(id);
    console.log(fetchedRatings);
    document.querySelector('.pending-review-list').innerHTML = "";
    Object.keys(fetchedRatings).forEach(name => {
        document.querySelector('.pending-review-list').innerHTML += 
        `
            <form action="/modify-rating" method="POST" class="pending-review">
                <h2>To : ${name}</h2>
                <input type="text" name="rating-content" placeholder="Enter Your Opinion.." class="review-text-input" required>
                <input type="hidden" name="rating-id" value="${fetchedRatings[name]}">
                <input type="submit" value="Submit Rating" class="review-text-btn">
            </form>
        `
    })
})();