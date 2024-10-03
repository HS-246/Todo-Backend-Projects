let form = document.getElementById("user-form");

const retrieveForm = () => {
  let Entries = localStorage.getItem("user-entries");
  if (Entries) {
    Entries = JSON.parse(Entries);
  } else {
    Entries = [];
  }
  return Entries;
};

let userEntries = retrieveForm();

// function validateDob(dob) {
//   const current = new Date();
//   let minDate = new Date();
//   let maxDate = new Date();
//   minDate.setFullYear(current.getFullYear() - 55);

//   maxDate.setFullYear(current.getFullYear() - 18);

//   console.log(minDate);
//   console.log(maxDate);
//   dob = new Date(dob);
//   if (dob >= minDate && dob <= maxDate) return true;
//   else return false;
// }

const saveForm = (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let dob = document.getElementById("dob").value;
  const tnc = document.getElementById("tnc").checked;

  //if (validateDob(dob)) {
  const entry = {
    name,
    email,
    password,
    dob,
    tnc,
  };

  userEntries.push(entry);

  localStorage.setItem("user-entries", JSON.stringify(userEntries));
  //} else {
  // let date = document.getElementById("dob");
  // date.setCustomValidity("must be between 18 and 55 years old");
  // date.reportValidity();
  //}
  makeTable();
};

form.addEventListener("submit", saveForm);

const makeRow = (entry) => {
  //<td class="border-b p-3">Jane Doe</td>
  let nameCell = `<td class='border-b p-3'>${entry.name}</td>`;
  let emailCell = `<td class='border-b p-3'>${entry.email}</td>`;
  let passwordCell = `<td class='border-b p-3'>${entry.password}</td>`;
  let dobCell = `<td class='border-b p-3'>${entry.dob}</td>`;
  let tncCell = `<td class='border-b p-3'>${entry.tnc}</td>`;

  const row = `<tr>${nameCell} ${emailCell} ${passwordCell} ${dobCell} ${tncCell}</tr>`;
  return row;
};

const makeTable = () => {
  let rows = userEntries.map(makeRow).join("\n");

  let table = `<table class='w-full text-left border-collapse'>
            <thead>
                <tr>
                    <th class='border-b p-3 text-gray-700'>Name</th>
                    <th class='border-b p-3 text-gray-700'>Email</th>
                    <th class='border-b p-3 text-gray-700'>Password</th>
                    <th class='border-b p-3 text-gray-700'>dob</th>
                    <th class='border-b p-3 text-gray-700'>accepted terms?</th>
                </tr>
            </thead>
            <tbody> ${rows}</tbody></table>`;

  let detail = document.getElementById("user-entries");
  detail.innerHTML = table;
};

makeTable();
