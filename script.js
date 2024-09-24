const apiKey = 'AIzaSyDtDryKKBIuxvSeBwYHuK05vz5fJlYb6Ts';
const spreadsheetId = '1OPLjNAzyCuXMYaS8T5pWUZ3lv9xEBDfQEmMxeyAfj5g';
const range = '02!A1:Z10000';

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rows = data.values;
            if (!rows) {
                throw new Error('No data found');
            }

            let userFound = false;

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const userId = row[22];
                const userPass = row[21];

                if (userId === username && userPass === password) {
                    userFound = true;
                    displayUserDetails(row);
                    break;
                }
            }

            if (!userFound) {
                alert("שם משתמש או סיסמא שגויים");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data, please check the API key and Spreadsheet settings.');
        });
});

function displayUserDetails(row) {
    document.getElementById('login-form').parentElement.style.display = 'none';

    document.getElementById('family-name').textContent = row[1];
    document.getElementById('parents-names').textContent = `${row[0]} ${row[1]}`;

    const childrenWrapper = document.getElementById('children-wrapper');
    childrenWrapper.innerHTML = '';

    for (let i = 3; i <= 16; i++) {
        if (row[i] && row[i].trim() !== '') {
            const childDiv = document.createElement('div');
            childDiv.className = 'child-container';
            childDiv.textContent = `${row[i]}`;
            childrenWrapper.appendChild(childDiv);
        }
    }

    document.getElementById('user-details').style.display = 'block';
}
