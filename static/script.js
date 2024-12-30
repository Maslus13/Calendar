const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const calendar = document.getElementById('calendar');
const saveButton = document.getElementById('saveButton');
const year = 2025;

const state = {};

document.addEventListener('DOMContentLoaded', () => {
    monthNames.forEach((month, index) => {
        const days = daysInMonth(year, index);
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');

        const monthName = document.createElement('div');
        monthName.classList.add('month-name');
        monthName.textContent = month;
        monthDiv.appendChild(monthName);

        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days');

        ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            daysGrid.appendChild(dayHeader);
        });

        for (let day = 1; day <= days; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');

            const label = document.createElement('span');
            label.textContent = day;

            ["PALENIE", "TRENING", "WITAMINY"].forEach(activity => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${month}-${day}-${activity}`;
                checkbox.checked = false;

                checkbox.addEventListener('change', () => {
                    state[checkbox.id] = checkbox.checked;
                    checkbox.parentNode.style.backgroundColor = checkbox.checked ? 'lightgreen' : '';
                });

                const checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = activity;
                checkboxLabel.appendChild(checkbox);

                dayDiv.appendChild(checkboxLabel);
            });

            daysGrid.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysGrid);
        calendar.appendChild(monthDiv);
    });

    fetch('/load')
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    checkbox.checked = value;
                    checkbox.parentNode.style.backgroundColor = value ? 'lightgreen' : '';
                    state[key] = value;
                }
            }
        })
        .catch(error => console.error('Błąd ładowania danych:', error));
});

saveButton.addEventListener('click', () => {
    console.log('Stan przed zapisem:', state);
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Odpowiedź serwera:', data);
        alert(data.message || 'Zapisano dane!');
    })
    .catch(error => console.error('Błąd zapisu:', error));
});
