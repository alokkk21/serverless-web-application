// ===============================
// COGNITO CONFIGURATION
// ===============================

const poolData = {
    UserPoolId: "us-east-1_ALgxAo3eU",
    ClientId: "6ap5fd71qjpo89iruckkt0gqvu"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


// ===============================
// AUTH ELEMENTS
// ===============================

const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");

const signUpButton = document.getElementById("signUpButton");
const confirmButton = document.getElementById("confirmButton");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");


// ===============================
// STUDENT ELEMENTS
// ===============================

const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");
const studentsContainer = document.getElementById("students");
const loadStudentsButton = document.getElementById("loadStudents");

let students = [];


// ===============================
// SIGN UP
// ===============================

signUpButton.addEventListener("click", function () {

    const email = authEmail.value;
    const password = authPassword.value;

    if (!email || !password) {
        authMessage.textContent = "Please enter email and password.";
        authMessage.style.color = "red";
        return;
    }

    const attributes = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email
        })
    ];

    userPool.signUp(
        email,
        password,
        attributes,
        null,
        function (err, result) {

            if (err) {
                console.error(err);

                authMessage.textContent = err.message;
                authMessage.style.color = "red";
                return;
            }

            authMessage.textContent =
                "Sign up successful! Check your email for OTP.";

            authMessage.style.color = "green";

            console.log("User created:", result.user);
        }
    );
});


// ===============================
// VERIFY OTP
// ===============================

confirmButton.addEventListener("click", function () {

    const email = authEmail.value;
    const otp = prompt("Enter the OTP sent to your email:");

    if (!email || !otp) {
        authMessage.textContent = "Email and OTP are required.";
        authMessage.style.color = "red";
        return;
    }

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser =
        new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(
        otp,
        true,
        function (err, result) {

            if (err) {
                console.error(err);

                authMessage.textContent = err.message;
                authMessage.style.color = "red";
                return;
            }

            authMessage.textContent =
                "Email verified successfully! Now you can login.";

            authMessage.style.color = "green";

            console.log("Verification result:", result);
        }
    );
});


// ===============================
// LOGIN
// ===============================

loginButton.addEventListener("click", function () {

    const email = authEmail.value;
    const password = authPassword.value;

    if (!email || !password) {
        authMessage.textContent = "Please enter email and password.";
        authMessage.style.color = "red";
        return;
    }

    const authenticationData = {
        Username: email,
        Password: password
    };

    const authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails(
            authenticationData
        );

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser =
        new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(
        authenticationDetails,
        {

            onSuccess: function (result) {

                authMessage.textContent =
                    "Login successful!";

                authMessage.style.color = "green";

                console.log("Login successful");
                console.log("ID Token:", result.getIdToken().getJwtToken());
            },

            onFailure: function (err) {

                console.error(err);

                authMessage.textContent =
                    err.message;

                authMessage.style.color = "red";
            }
        }
    );
});


// ===============================
// LOGOUT
// ===============================

logoutButton.addEventListener("click", function () {

    const currentUser = userPool.getCurrentUser();

    if (currentUser) {

        currentUser.signOut();

        authMessage.textContent =
            "Logged out successfully.";

        authMessage.style.color = "green";

    } else {

        authMessage.textContent =
            "No user is currently logged in.";

        authMessage.style.color = "red";
    }
});


// ===============================
// ADD STUDENT
// ===============================

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

    message.textContent =
        "Student added successfully!";

    message.style.color = "green";

    studentForm.reset();

    displayStudents();
});


// ===============================
// LOAD STUDENTS
// ===============================

loadStudentsButton.addEventListener("click", function () {

    displayStudents();

});


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {

    if (students.length === 0) {

        studentsContainer.innerHTML =
            "<p>No students found.</p>";

        return;
    }

    studentsContainer.innerHTML = "";

    students.forEach(function (student) {

        const studentDiv =
            document.createElement("div");

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