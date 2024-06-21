let allEmployees = "";
const fetchEmployees = (async () => {
    await fetch('/fetch-employees')
    .then(response => response.json())
    .then(data => {
        allEmployees = data;
        // console.log("all employess in client: ", allEmployees);
    })
    .catch(err => { return {'message': `Error Occured while fetching only employees list from mongo (This is client side) (err = ${err})` } });
})();


const showEditMenu = (id) => {
        document.querySelector('.edit-employee').innerHTML =
        `
            <form action="/edit-employee" method="POST" class="edit-details">
                <h2>Edit Value Section</h2>
                <div class="edit-details-inside">
                    <select name="role" required>
                        <option selected disabled>Choose Field You Want To Edit</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="password">Password</option>
                        <option value="role">Role (Use only 'Admin' or 'Employee')</option>
                    </select>
                    <input type="text" name="edit-needed" placeholder="Enter New Value..." required>
                    <input type="hidden" name="employee-id" value="${id}">
                </div>
                <input class="make-changes" type="submit" value="Make Changes">
            </form>
        `
}

const assignReviewSection = (id) => {
    let assignReview = document.querySelector('.assign-review select');
    assignReview.innerHTML = `<option selected disabled>Choose the Employee You Want To Assign Review To:</option>`;
    allEmployees.forEach(emp => {
        if(emp['_id'] != id){
            assignReview.innerHTML += `<option value="${emp['_id']}">${emp.name} :- ${emp.email}</option>`;
        } else {
            document.querySelector('.employee-name').innerHTML = emp.name;
        }
    })
    document.querySelector('.review-section').classList.remove('hidden');
    document.querySelector('.assign-review-btns').innerHTML = 
    `
        <input type="submit" value="Send Request" class="send-request">
        <input type="hidden" name="assign-review-to" value="${id}">
    `
}

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

const renderRatings = async (id) => {
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
}

document.querySelectorAll('.employee-btn').forEach((btn) => {
    btn.addEventListener('click', async (btn) => {
        showEditMenu(btn.target.id);
        assignReviewSection(btn.target.id);
        await renderRatings(btn.target.id);
    })
});
