const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");
const studentsContainer = document.getElementById("students");
const loadStudentsButton = document.getElementById("loadStudents");

let students = [];

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const student = {
        studentId: Date.now(),
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
        course: document.getElementById("course").value
    };

    students.push(student);

    message.textContent = "Student added successfully!";
    message.style.color = "green";

    studentForm.reset();

    displayStudents();
});

loadStudentsButton.addEventListener("click", function () {
    displayStudents();
});

function displayStudents() {

    if (students.length === 0) {
        studentsContainer.innerHTML = "<p>No students found.</p>";
        return;
    }

    studentsContainer.innerHTML = "";

    students.forEach(function (student) {

        const studentDiv = document.createElement("div");

        studentDiv.className = "student";

        studentDiv.innerHTML = `
            <strong>Name:</strong> ${student.name}<br>
            <strong>Email:</strong> ${student.email}<br>
            <strong>Age:</strong> ${student.age}<br>
            <strong>Course:</strong> ${student.course}
        `;

        studentsContainer.appendChild(studentDiv);
    });
}