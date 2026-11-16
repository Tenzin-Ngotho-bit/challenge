
// Store all students
let students = JSON.parse(localStorage.getItem("students")) || [];

// Get HTML elements
const studentForm = document.getElementById("studentForm");
const recordsBody = document.getElementById("recordsBody");
const formMessage = document.getElementById("formMessage");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");

// Save students in local storage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Determine student performance
function getPerformance(marks) {
    if (marks >= 80) {
        return "Excellent";
    } else if (marks >= 70) {
        return "Very Good";
    } else if (marks >= 60) {
        return "Good";
    } else if (marks >= 50) {
        return "Average";
    } else {
        return "Failed";
    }
}

// Register a student
studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const course = document.getElementById("course").value;
    const marks = Number(document.getElementById("marks").value);

    // Validate information
    if (!name || !gender || !course ||
        document.getElementById("age").value.trim() === "" ||
        document.getElementById("marks").value.trim() === "") {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "red";
        return;
    }

    if (!Number.isInteger(age) || age <= 0) {
        formMessage.textContent = "Please enter a valid age.";
        formMessage.style.color = "red";
        return;
    }

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        formMessage.textContent = "Marks must be between 0 and 100.";
        formMessage.style.color = "red";
        return;
    }

    // Create student object
    const student = {
        id: Date.now() + Math.random(),
        name: name,
        age: age,
        gender: gender,
        course: course,
        marks: marks,
        performance: getPerformance(marks)
    };

    // Add student to array
    students.push(student);

    // Save and update records
    saveStudents();
    displayStudents(students);
    updateDashboard();

    // Clear form
    studentForm.reset();

    formMessage.textContent = "Student registered successfully!";
    formMessage.style.color = "green";
});

// Display student records
function displayStudents(studentList) {
    recordsBody.innerHTML = "";

    if (studentList.length === 0) {
        recordsBody.innerHTML = `
            <tr>
                <td colspan="7">No student records found.</td>
            </tr>
        `;
        return;
    }

    studentList.forEach(function(student) {
        const row = document.createElement("tr");

        [
            student.name,
            student.age,
            student.gender,
            student.course,
            student.marks,
            student.performance
        ].forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "btn";

        deleteButton.addEventListener("click", function() {
            deleteStudent(student.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        recordsBody.appendChild(row);
    });
}

// Delete a student
function deleteStudent(id) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {
        students = students.filter(function(student) {
            return student.id !== id;
        });

        saveStudents();
        displayStudents(students);
        updateDashboard();
    }
}

// Update dashboard statistics
function updateDashboard() {
    const total = students.length;

    const passed = students.filter(function(student) {
        return student.marks >= 50;
    }).length;

    const failed = students.filter(function(student) {
        return student.marks < 50;
    }).length;

    const totalMarks = students.reduce(function(sum, student) {
        return sum + student.marks;
    }, 0);

    const average = total === 0 ? 0 : (totalMarks / total).toFixed(2);

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("totalPassed").textContent = passed;
    document.getElementById("totalFailed").textContent = failed;
    document.getElementById("averageMarks").textContent = average;

    // Update performance summary
    document.getElementById("countExcellent").textContent =
        students.filter(s => s.performance === "Excellent").length;

    document.getElementById("countVeryGood").textContent =
        students.filter(s => s.performance === "Very Good").length;

    document.getElementById("countGood").textContent =
        students.filter(s => s.performance === "Good").length;

    document.getElementById("countAverage").textContent =
        students.filter(s => s.performance === "Average").length;

    document.getElementById("countFailed").textContent =
        failed;
}

// Search for a student
searchBtn.addEventListener("click", function() {
    const searchValue = searchInput.value.trim().toLowerCase();

    if (!searchValue) {
        document.getElementById("searchMessage").textContent =
            "Please enter a student name.";

        displayStudents(students);
        return;
    }

    const results = students.filter(function(student) {
        return student.name.toLowerCase().includes(searchValue);
    });

    displayStudents(results);

    document.getElementById("searchMessage").textContent =
        results.length + " student(s) found.";
});

// Show all students
showAllBtn.addEventListener("click", function() {
    searchInput.value = "";

    document.getElementById("searchMessage").textContent = "";

    displayStudents(students);
});

// Register button in hero section
document.querySelector(".hero .black").addEventListener("click", function() {
    document.getElementById("register").scrollIntoView({
        behavior: "smooth"
    });
});

// Load saved records when page opens
displayStudents(students);
updateDashboard();
