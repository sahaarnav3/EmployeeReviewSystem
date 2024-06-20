let allEmployees = "";
const fetchEmployees = (async () => {
    await fetch('/fetch-employees')
    .then(response => response.json())
    .then(data => {
        allEmployees = data;
        console.log("all employess in client: ", allEmployees);
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
    document.querySelector('.review-section').classList.remove('hidden');
    assignReview.innerHTML = `<option selected disabled>Choose the Employee You Want To Assign Review To:</option>`;
    allEmployees.forEach(emp => {
        if(emp['_id'] != id){
            assignReview.innerHTML += `<option value="${emp['_id']}">${emp.name} :- ${emp.email}</option>`;
        }
    })
    document.querySelector('.assign-review-btns').innerHTML = 
    `
        <input type="submit" value="Send Request" class="send-request">
        <input type="hidden" name="assign-review-to" value="${id}">
    `
}

document.querySelectorAll('.employee-btn').forEach((btn) => {
    btn.addEventListener('click', (btn) => {
        console.log(btn.target.id);
        showEditMenu(btn.target.id);
        assignReviewSection(btn.target.id);
    })
});

document.querySelector('.send-request').addEventListener('click', () => {
    console.log('dab dab');
})