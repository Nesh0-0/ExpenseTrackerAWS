let entriesPerPage = parseInt(document.getElementById('pagination').value, 10);
let totalCount = 0;
// Listen to entriesPerPage (rows-per-page) change
document.getElementById('pagination').addEventListener('change', function () {
    entriesPerPage = parseInt(this.value, 10);
    localStorage.setItem('currPage', 1);
    renderExpensesAndPagination();
});

window.addEventListener('load', renderExpensesAndPagination);

async function renderExpensesAndPagination() {
    try {
        if (await checkIfPremiumUser()) {
            activateLeaderBoard();
            activateDownload();
            disablePremiumBtn();
        }
        const currPage = getCurrentPage();
        await getExpenses(entriesPerPage, currPage);   // Populate expenses list
        await renderPagination(entriesPerPage, currPage); // Draw pagination controls
    } catch (err) {
        console.error(err);
        alert('Error! Could not load page!');
    }
}

const getCurrentPage = () => {
    let currPage = parseInt(localStorage.getItem('currPage'), 10);
    if (!currPage) currPage = 1;
    return currPage;
};

const setCurrentPage = (page) => {
    localStorage.setItem('currPage', page);
};

const getExpenses = async (entries, currPage) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await axios.get(`/expenses/getExpenses?page=${currPage}&entries=${entries}`, {
            headers: { 'Authorization': token }
        });
        console.log('Yayyy');

        const data = response.data.expenses || response.data; // Adjust if your backend returns {expenses:[], totalCount: n}
        console.log(data);
        let table = document.getElementById('expensesTable');
        if (table) {
            table.remove();
        }
        table = document.createElement('table');
        table.className = 'table table-striped table-bordered';
        table.id = 'expensesTable';

        const thead = document.createElement('thead');
        thead.innerHTML = `
                        <tr>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');


        for (const expense of data) {
            const tr = document.createElement('tr');
            const {id, amount, description, category} = expense;
            tr.id = id;
            tr.innerHTML = `
                                <td>${amount}</td>
                                <td>${description}</td>
                                <td>${category}</td>
                                <td><button class="btn btn-sm btn-danger" onclick="deleteExpense(${id})">Delete</button></td>
                            `;
            tbody.appendChild(tr);

        }

        table.appendChild(tbody);
        let expensesDiv = document.getElementById('expensesDiv');
        expensesDiv.innerHTML = '';
        expensesDiv.appendChild(table);

    }
    catch (err) {
        alert(err);
        console.log(err);
    }
};

// --- PAGINATION RENDER FUNCTION ---
const renderPagination = async (entries, currPage) => {
    // Get total count of expenses (modify your API to send totalCount in /getExpenses, or make a new endpoint!)

    try {
        const token = JSON.parse(localStorage.getItem('token'));
        const result = await axios.get(`/expenses/count`, { headers: { 'Authorization': token } });
        totalCount = result.data.totalCount;
        console.log(`Total expenses count: ${totalCount}`);
    } catch (err) {
        console.error("Failed to fetch total count", err);
        return;
    }
    const totalPages = Math.ceil(totalCount / entries);

    // Render controls
    const paginationDiv = document.getElementById('paginationControls');
    paginationDiv.innerHTML = "";

    // Prev
    const prevBtn = document.createElement('button');
    prevBtn.innerText = "Prev";
    prevBtn.disabled = currPage <= 1;
    prevBtn.addEventListener('click', function () {
        if (currPage > 1) {
            setCurrentPage(currPage - 1);
            renderExpensesAndPagination();
        }
    });
    paginationDiv.appendChild(prevBtn);


    const select = document.createElement('select');
    select.id = 'pageSelect';

    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}`;
        if (i === currPage) option.selected = true;
        select.appendChild(option);
    }

    select.addEventListener('change', (event) => {
        const selectedPage = parseInt(event.target.value, 10);
        setCurrentPage(selectedPage);
        renderExpensesAndPagination();
    });

    paginationDiv.appendChild(select);

    // Next
    const nextBtn = document.createElement('button');
    nextBtn.innerText = "Next";
    nextBtn.disabled = currPage >= totalPages;
    nextBtn.addEventListener('click', function () {
        if (currPage < totalPages) {
            setCurrentPage(currPage + 1);
            renderExpensesAndPagination();
        }
    });
    paginationDiv.appendChild(nextBtn);
};


const activateLeaderBoard = () => {
    const leaderBoard = document.getElementById('LeaderboardDiv');
    if (!document.getElementById('leaderboardBtn')) {
        const btn = document.createElement('button');
        btn.id = 'leaderboardBtn';
        btn.type = 'button';
        btn.innerText = 'Get Leaderboard';
        btn.onclick = getLeaderboard;
        btn.className = "btn btn-warning";
        leaderBoard.appendChild(btn);
    }
    
};

const activateDownload = () => {
    const download = document.getElementById('LeaderboardDiv');
    if (!document.getElementById('downloadBtn')) {
        const btn = document.createElement('button');
        btn.id = 'downloadBtn';
        btn.type = 'button';
        btn.onclick = downloadReport;
        btn.innerHTML = 'Download';
        btn.className = "btn btn-warning";
        download.appendChild(btn);
    }
};

const downloadReport = async () => {
    try {
        console.log('Inside dowloadReport');
        const token = JSON.parse(localStorage.getItem('token'));
        console.log('token = ', token);
        const download = await axios.get('/premium/download', { headers: { 'Authorization': token } });
        const fileurl = download.data.url;
        console.log(download.data);
        window.location.href = fileurl;
    }
    catch (err) {
        console.log(err.response.data);
        alert(err.response.data);
    }
};

const getLeaderboard = async () => {
    try {
        console.log('Leaderboard Clicked!');
        const token = JSON.parse(localStorage.getItem('token'));

        const leaderboard = await axios.get('/premium/leaderboard', {
            headers: { 'Authorization': token }
        });

        const data = leaderboard.data.data;

        // Wrapper div for leaderboard content
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.id = 'leaderboardDetails';
        leaderboardContainer.className = 'card my-3 shadow rounded';

        // Header with close button
        const header = document.createElement('div');
        header.className = 'card-header d-flex justify-content-between align-items-center';
        header.innerHTML = `
            <h5 class="mb-0">Leaderboard</h5>
            <button type="button" class="btn-close" aria-label="Close"></button>
        `;

        // Close button functionality
        header.querySelector('.btn-close').addEventListener('click', () => {
            leaderboardContainer.remove();
        });

        // List group for leaderboard items
        const ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush';

        data.forEach((element, index) => {
            const { name, totalExpense } = element;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            const userSpan = document.createElement('span');
            userSpan.innerHTML = `<strong>${index + 1}.</strong> ${name}`;

            const badge = document.createElement('span');
            badge.className = 'badge bg-primary rounded-pill';
            badge.textContent = totalExpense;

            li.appendChild(userSpan);
            li.appendChild(badge);
            ul.appendChild(li);
        });

        // Append all parts
        leaderboardContainer.appendChild(header);
        leaderboardContainer.appendChild(ul);

        const leaderboardDiv = document.getElementById('LeaderboardDiv');
        const existing = document.getElementById('leaderboardDetails');
        if (existing) existing.remove(); // prevent duplication
        leaderboardDiv.appendChild(leaderboardContainer);

    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        alert('Could not load leaderboard');
    }
};



const disablePremiumBtn = () => {
    const premiumBtn = document.getElementById('getPremiumBtn');
    if (premiumBtn) {
        premiumBtn.remove();
    }
};


const getPremium = () => {
    window.location.href = '/payments/pay';
};


const checkIfPremiumUser = async () => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        const isPremium = await axios.get('/payments/isPremium', {
            headers: { 'Authorization': token }
        });
        return isPremium.data.success;
    } catch (err) {
        console.error('Error checking premium status:', err);
        return false;
    }
};


const handleSubmitEvent = async event => {
    event.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;


    if (!amount || !description || !category) {
        alert('Please fill in all fields.');
        return;
    }


    const expense = { amount, description, category };
    const token = JSON.parse(localStorage.getItem('token'));


    try {
        const addExpense = await axios.post('/expenses/addExpense', expense, {
            headers: { 'Authorization': token }
        });
        if (addExpense.data) {
            alert('Expense successfully added!');
        }
        if (totalCount < entriesPerPage) {
            const expensesDiv = document.getElementById('expensesDiv');
            let table = document.getElementById('expensesTable');

            if (!table) {
                table = document.createElement('table');
                table.className = 'table table-striped table-bordered';
                table.id = 'expensesTable';

                const thead = document.createElement('thead');
                thead.innerHTML = `
        <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Category</th>
            <th>Action</th>
        </tr>
    `;
                table.appendChild(thead);
                table.appendChild(document.createElement('tbody'));
                expensesDiv.innerHTML = '';
                expensesDiv.appendChild(table);
            }

            const tbody = table.querySelector('tbody');
            const tr = document.createElement('tr');
            tr.id = addExpense.data.id;
            tr.innerHTML = `
                                <td>${amount}</td>
                                <td>${description}</td>
                                <td>${category}</td>
                                <td><button class="btn btn-sm btn-danger" onclick="deleteExpense(${addExpense.data.id})">Delete</button></td>
                            `;
            tbody.appendChild(tr);
            totalCount++;

        }
        else {
            renderExpensesAndPagination();
        }


    } catch (err) {
        console.error(err);
        alert('Error! Could not add expense!');
    }
};


const deleteExpense = async id => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        await axios.delete(`/expenses/deleteExpense/${id}`, {
            headers: { 'Authorization': token }
        });


        const element = document.getElementById(id);
        console.log('Element to delete:', element);
        if (element) {
            element.remove();
            if (document.querySelectorAll('tr').length === 1 && getCurrentPage() > 1) {
                    setCurrentPage(getCurrentPage() - 1);
                }
                console.log('length = ', document.querySelectorAll('tr').length);
                renderExpensesAndPagination();


        }
    } catch (err) {
        console.error(err);
        alert('Error! Could not delete expense!');
    }
};
