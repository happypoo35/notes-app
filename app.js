document.addEventListener("DOMContentLoaded", redraw);

const form = document.getElementById("addnew");
const input = document.getElementById("input");
const addBtn = document.getElementById("add-btn");
const expandBtn = document.getElementById("plus-btn");
const noteList = document.querySelector(".notes-container");
const noNotes = document.querySelector(".empty-list");
// Date
const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const fullMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const month = fullMonth[String(today.getMonth())];
const yyyy = String(today.getFullYear());
const noteDate = `${month} ${dd}, ${yyyy}`;


// Input field auto-grow
function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}

// Expand-collapse form
expandBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.toggle("collapse");
  expandBtn.classList.toggle("plus-toggle");
  input.style.height = "";
  input.value = "";
});

// Add new note
let notesObj = [];

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!input.value) return;

  notesObj.push({ text: input.value, date: noteDate });
  redraw();

  input.style.height = "";
  input.value = "";
});

(function getNotes() {
  !localStorage.getItem("notes")
    ? (notesObj = [])
    : (notesObj = JSON.parse(localStorage.getItem("notes")));
})();

function redraw() {
  noNotes.style.display = notesObj.length == 0 ? "inline" : "none";

  noteList.innerHTML = "";
  notesObj.forEach((el, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.innerHTML = `<textarea id='note-text' maxlength="240" onblur="editEnd(this)" disabled>${el.text}</textarea>
        <div class="note-footer">
          <p class="date">${el.date}</p>
          <button class="edit-btn" id="edit-btn" onclick="edit(this,${index})"><i class="far fa-edit"></i></button>
          <button class="delete-btn" id="delete-btn" onclick="del(this,${index})"><i class="far fa-trash-alt"></i></button>
        </div>`;

    noteList.appendChild(noteDiv);
  });

  saveLocalNotes();
}

// Save note
function saveLocalNotes() {
  let notes;
  !localStorage.getItem("notes")
    ? (notes = [])
    : (notes = JSON.parse(localStorage.getItem("notes")));

  localStorage.setItem("notes", JSON.stringify(notesObj));
}

// Edit note
function edit(s, index) {
  const note = s.parentElement.parentElement;
  notesObj[index].text = note.firstChild.value;

  saveLocalNotes();

  const noteInput = note.firstChild;
  const noteEditIcon = s.firstChild;
  noteInput.toggleAttribute("disabled");
  noteInput.focus();
  noteInput.classList.toggle("edit-content");
  noteEditIcon.classList.toggle("fa-edit");
  noteEditIcon.classList.toggle("fa-check-square");
}

function editEnd(s) {
  setTimeout(() => {
    s.disabled = true;
    s.classList.remove("edit-content");
    const editIcon = s.nextElementSibling.children[1].firstChild;
    editIcon.classList.remove("fa-check-square");
    editIcon.classList.add("fa-edit");
  }, 200);
}

// Delete note
function del(s, index) {
  const note = s.parentElement.parentElement;
  removeLocalNotes(note);
  note.classList.add("bye");
  note.addEventListener("transitionend", () => {
    if (noteList.childElementCount === 0) {
      noNotes.style.display = "inline";
    }
    note.remove();
    notesObj.splice(index, 1);
  });
}

function removeLocalNotes(note) {
  let notes;
  !localStorage.getItem("notes")
    ? (notes = [])
    : (notes = JSON.parse(localStorage.getItem("notes")));

  const noteIndex = note.children[0].innerHTML;
  notes.splice(notes.indexOf(noteIndex), 1);
  localStorage.setItem("notes", JSON.stringify(notes));
}
