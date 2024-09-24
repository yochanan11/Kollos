const apiKey = 'AIzaSyDtDryKKBIuxvSeBwYHuK05vz5fJlYb6Ts';

// גליון עבור כניסת המשתמשים
const loginSpreadsheetId = '1OPLjNAzyCuXMYaS8T5pWUZ3lv9xEBDfQEmMxeyAfj5g';
const loginRange = '02!A1:Z10000';

// גליון עבור רשימת הנולדים שלא עודכנו שמות
const listSpreadsheetId = '1ga_B1xAOGtju05eFE4qIE0kBL1bLcl7JV2ttpmqCegw';
const listRange = 'A1:C100';

// פונקציה לשליפת נתונים מהשיטס של רשימת הנולדים
function fetchGoogleSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${listSpreadsheetId}/values/${listRange}?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rows = data.values;
            if (!rows || rows.length === 0) {
                alert('לא נמצאו נתונים');
                return;
            }

            const tableBody = document.querySelector('#googleSheetTable tbody');
            tableBody.innerHTML = ''; // איפוס התוכן הקיים בטבלה

            rows.slice(1).forEach(row => {
                const rowElement = document.createElement('tr');

                row.forEach(cell => {
                    const cellElement = document.createElement('td');
                    cellElement.textContent = cell;
                    rowElement.appendChild(cellElement);
                });

                tableBody.appendChild(rowElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('שגיאה בטעינת הנתונים.');
        });
}

// פונקציה להחלפת התצוגה לטופס גוגל
function showGoogleForm() {
    document.getElementById('google-form').style.display = 'block';
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('user-details').style.display = 'none';
    document.getElementById('google-sheet').style.display = 'none';
}

// פונקציה להחלפת התצוגה לטבלת הנולדים שלא עודכנו שמות
function showGoogleSheet() {
    document.getElementById('google-form').style.display = 'none';
    document.getElementById('google-sheet').style.display = 'block';
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('user-details').style.display = 'none';
    fetchGoogleSheetData(); // שליפת הנתונים מהשיטס
}

// פונקציה להציג את מסך הכניסה
function showLogin() {
    document.getElementById('google-form').style.display = 'none';
    document.getElementById('google-sheet').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
    document.getElementById('user-details').style.display = 'none';
}

// פונקציה לטיפול בכניסת המשתמשים מהשיטס הראשון
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${loginSpreadsheetId}/values/${loginRange}?key=${apiKey}`;

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
                const userId = row[22]; // "מספר אישי" בעמודה ה-22
                const userPass = row[21]; // "משפ עצמי" בעמודה ה-21

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

// פונקציה להצגת פרטי המשתמש שנמצא מהשיטס הראשון
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
