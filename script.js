
// Fetch CSV and process data
async function fetchCSV() {
   const response = await fetch('https://raw.githubusercontent.com/ArenaPlanning/ArenaPlanning.github.io/refs/heads/main/schedule.csv');
   const csvData = await response.text();

   const rows = csvData.trim().split('\n').map(row => row.split(','));
   const classData = {};
   rows.forEach(row => {
     const classCode = row[0];
     const periods = row[1].split(';');
     classData[classCode] = periods;
   });

   return classData;
}

// Generate possible schedules
async function generateSchedules() {
   const classData = await fetchCSV();
   const selectedClasses = Array.from(document.querySelectorAll('input[name="class"]:checked')).map(input => input.value);

   if (selectedClasses.length === 0) {
     document.getElementById('output').textContent = 'Please select at least one class.';
     return;
   }

   const schedules = generateClassSchedules(selectedClasses, classData);
   displaySchedules(schedules);
}

// Updated function to generate all possible combinations (permutations) of class schedules
function generateClassSchedules(selectedClasses, classData) {
   const periods = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

   let schedules = [];

   function generatePermutations(currentSchedule, remainingClasses) {
     if (remainingClasses.length === 0) {
       schedules.push(currentSchedule);
       return;
     }

     const currentClass = remainingClasses[0];
     const availablePeriods = classData[currentClass];

     availablePeriods.forEach(period => {
       if (!currentSchedule.some(entry => entry.period === period)) {
         generatePermutations([...currentSchedule, { classCode: currentClass, period }], remainingClasses.slice(1));
       }
     });
   }

   generatePermutations([], selectedClasses);
   return schedules;
}

// Updated function to display the generated schedules in HTML as tables
function displaySchedules(schedules) {
   const output = document.getElementById('output');
   output.innerHTML = '';

   if (schedules.length === 0) {
     output.textContent = 'No possible schedules found due to conflicts.';
     return;
   }

   const periods = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

   schedules.forEach(schedule => {
     const table = document.createElement('table');
     table.style.border = '1px solid black';
     table.style.borderCollapse = 'collapse';
     table.style.marginBottom = '20px';

     const headerRow = document.createElement('tr');
     const periodHeader = document.createElement('th');
     periodHeader.textContent = 'Period';
     periodHeader.style.border = '1px solid black';
     const classHeader = document.createElement('th');
     classHeader.textContent = 'Class';
     classHeader.style.border = '1px solid black';
     headerRow.appendChild(periodHeader);
     headerRow.appendChild(classHeader);
     table.appendChild(headerRow);

     periods.forEach(period => {
       const row = document.createElement('tr');
       const periodCell = document.createElement('td');
       const classCell = document.createElement('td');

       periodCell.textContent = period;
       periodCell.style.border = '1px solid black';

       const classEntry = schedule.find(entry => entry.period === period);
       classCell.textContent = classEntry ? classEntry.classCode : 'Free Block';
       classCell.style.border = '1px solid black';

       row.appendChild(periodCell);
       row.appendChild(classCell);
       table.appendChild(row);
     });

     output.appendChild(table);
   });
}
