// Function to fetch the CSV and process the data
async function fetchCSV() {
  const response = await fetch('https://raw.githubusercontent.com/ArenaPlanning/ArenaPlanning.github.io/refs/heads/main/schedule.csv'); // Update with your CSV file's location
  const csvData = await response.text();

  // Split the CSV data into rows and columns
  const rows = csvData.trim().split('\n').map(row => row.split(','));

  // Convert rows into a more usable object
  const classData = {};
  rows.forEach(row => {
    const classCode = row[0];
    const periods = row[1].split(';');
    classData[classCode] = periods;
  });

  return classData;
}

function generateSchedules() {
  const checkedClasses = checkCheckboxes(); // Get checked classes
  const allScheduleOptions = generatePermutations(checkedClasses); // Generate all permutations
  
  const outputDiv = document.getElementById('scheduleOutput');
  outputDiv.innerHTML = ''; // Clear previous output

  allScheduleOptions.forEach(schedule => {
    const table = document.createElement('table'); // Create a new table
    const headerRow = document.createElement('tr'); // Create the header row

    // Create headers for "Period" and "Class"
    const periodHeader = document.createElement('th');
    periodHeader.innerText = "Period";
    const classHeader = document.createElement('th');
    classHeader.innerText = "Class";
    headerRow.appendChild(periodHeader);
    headerRow.appendChild(classHeader);
    table.appendChild(headerRow); // Add the header row to the table

    // Create an object to map classes to periods for this schedule option
    const periods = {
      A: "Free Block",
      B: "Free Block",
      C: "Free Block",
      D: "Free Block",
      E: "Free Block",
      F: "Free Block",
      G: "Free Block",
      H: "Free Block"
    };

    // Assign classes to the periods they are scheduled for
    schedule.forEach(classData => {
      const [className, offeredPeriods] = classData.split(':');
      const periodList = offeredPeriods.split(';');
      periodList.forEach(period => {
        periods[period] = className;
      });
    });

    // Create table rows for each period (A to H)
    for (const period in periods) {
      const row = document.createElement('tr');
      const periodCell = document.createElement('td');
      periodCell.innerText = period;
      const classCell = document.createElement('td');
      classCell.innerText = periods[period];

      row.appendChild(periodCell);
      row.appendChild(classCell);
      table.appendChild(row);
    }

    // Append the table for the current schedule option
    outputDiv.appendChild(table);
    outputDiv.appendChild(document.createElement('br')); // Add space between schedules
  });
}


// Function to display the generated schedules in HTML
function displaySchedules(schedules) {
  const output = document.getElementById('output');
  output.innerHTML = '';

  if (schedules.length === 0) {
    output.textContent = 'No possible schedules found due to conflicts.';
    return;
  }

  schedules.forEach(schedule => {
    const scheduleText = schedule.map(entry => `${entry.classCode}: Period ${entry.period}`).join(', ');
    const scheduleElement = document.createElement('p');
    scheduleElement.textContent = scheduleText;
    output.appendChild(scheduleElement);
  });
}
