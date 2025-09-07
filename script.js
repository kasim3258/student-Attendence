// Predefined users with student IDs as both username and password
let users = JSON.parse(localStorage.getItem("users")) || {
    // Teacher account
    teacher: { username: "teacher", password: "teachpass2023", type: "teacher", name: "Professor Johnson" },
    
    // Student accounts - using student ID as both username and password
    "S1001": { username: "S1001", password: "S1001", type: "student", name: "John Smith", studentId: "S1001" },
    "S1002": { username: "S1002", password: "S1002", type: "student", name: "Emma Johnson", studentId: "S1002" },
    "S1003": { username: "S1003", password: "S1003", type: "student", name: "Michael Brown", studentId: "S1003" },
    "S1004": { username: "S1004", password: "S1004", type: "student", name: "Sarah Davis", studentId: "S1004" },
    "S1005": { username: "S1005", password: "S1005", type: "student", name: "Robert Wilson", studentId: "S1005" },
    "S1006": { username: "S1006", password: "S1006", type: "student", name: "Jennifer Lee", studentId: "S1006" },
    "S1007": { username: "S1007", password: "S1007", type: "student", name: "David Miller", studentId: "S1007" },
    "S1008": { username: "S1008", password: "S1008", type: "student", name: "Lisa Taylor", studentId: "S1008" }
};
// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const attendanceSection = document.getElementById('attendance-section');
const reportsSection = document.getElementById('reports-section');
const profileSection = document.getElementById('profile-section');
const scheduleModal = document.getElementById('schedule-modal');
const saveIndicator = document.getElementById('save-indicator');
const profileSaveIndicator = document.getElementById('profile-save-indicator');
const navMenu = document.getElementById('nav-menu');
const studentLoginNote = document.getElementById('student-login-note');
const usernameLabel = document.getElementById('username-label');

const dashboardLink = document.getElementById('dashboard-link');
const attendanceLink = document.getElementById('attendance-link');
const reportsLink = document.getElementById('reports-link');
const profileLink = document.getElementById('profile-link');
const logoutLink = document.getElementById('logout-link');

const loginBtn = document.getElementById('login-btn');
const userTypeButtons = document.querySelectorAll('.user-type-btn');
const exportCsvBtn = document.getElementById('export-csv');
const exportPdfBtn = document.getElementById('export-pdf');
const viewAllBtn = document.getElementById('view-all-btn');
const saveAttendanceBtn = document.getElementById('save-attendance');
const saveProfileBtn = document.getElementById('save-profile-btn');
const closeModalBtn = document.querySelector('.close-btn');
const classButtons = document.querySelectorAll('.class-btn');

const teacherAttendance = document.getElementById('teacher-attendance');
const studentAttendance = document.getElementById('student-attendance');
const attendanceTitle = document.getElementById('attendance-title');

let userType = 'teacher'; // Default
let currentUser = null;

// Set current date
const currentDateElement = document.getElementById('current-date');
const today = new Date();
const options = { day: 'numeric', month: 'long', year: 'numeric' };
if(currentDateElement) currentDateElement.textContent = today.toLocaleDateString('en-US', options);

// Initially hide all sections except login (for index.html)
if(loginSection) loginSection.classList.remove('hidden');
if(dashboardSection) dashboardSection.classList.add('hidden');
if(attendanceSection) attendanceSection.classList.add('hidden');
if(reportsSection) reportsSection.classList.add('hidden');
if(profileSection) profileSection.classList.add('hidden');
if(navMenu) navMenu.classList.add('hidden');

// User type selection
if(userTypeButtons){
    userTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            userTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            userType = button.getAttribute('data-type');
            
            // Update UI based on user type
            if (userType === 'student') {
                usernameLabel.textContent = 'Student ID';
                document.getElementById('username').placeholder = 'Enter your Student ID';
                studentLoginNote.classList.remove('hidden');
            } else {
                usernameLabel.textContent = 'Username';
                document.getElementById('username').placeholder = 'Enter your username';
                studentLoginNote.classList.add('hidden');
            }
        });
    });
}

// Login functionality (in index.html)
if(loginBtn){
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // For students, use student ID as both username and password
        const loginUsername = (userType === 'student') ? username : username;
        const loginPassword = (userType === 'student') ? username : password;
        
        if (users[loginUsername] && users[loginUsername].password === loginPassword && users[loginUsername].type === userType) {
            currentUser = users[loginUsername];
            localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
            
            // Erase login details
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            
            // Redirect to dashboard.html
            window.location.href = 'dashboard.html';
        } else {
            if (userType === 'student') {
                alert('Invalid Student ID! Please enter your correct Student ID.');
            } else {
                alert('Invalid credentials!');
            }
        }
    });
}

// On dashboard.html load, check if logged in
if(window.location.pathname.endsWith('dashboard.html')){
    currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if(!currentUser){
        window.location.href = 'index.html'; // Redirect to login if not logged in
    } else {
        userType = currentUser.type;
        const displayName = currentUser.name || currentUser.username;
        document.getElementById('user-name').textContent = displayName;
        document.getElementById('user-display-name').textContent = displayName;
        navMenu.classList.remove('hidden');
        dashboardSection.classList.remove('hidden');
        updateUIForUserType();
        updateDashboardStats();
    }
}

// The rest of the JS remains the same as in your attached code (navigation, attendance marking, reports, etc.)
// Update UI based on user type
function updateUIForUserType() {
    if (userType === 'teacher') {
        attendanceLink.textContent = 'Mark Attendance';
        reportsLink.textContent = 'Reports';
    } else {
        attendanceLink.textContent = 'View Attendance';
        reportsLink.textContent = 'View Reports';
    }
}

// Navigation
if(dashboardLink) dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(dashboardSection);
    updateDashboardStats();
});

if(attendanceLink) attendanceLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(attendanceSection);
    if (userType === 'teacher') {
        attendanceTitle.textContent = 'Mark Attendance';
        teacherAttendance.classList.remove('hidden');
        studentAttendance.classList.add('hidden');
    } else {
        attendanceTitle.textContent = 'View Attendance';
        teacherAttendance.classList.add('hidden');
        studentAttendance.classList.remove('hidden');
        loadStudentRecords(currentUser.username);
    }
});

if(reportsLink) reportsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(reportsSection);
    if (userType === 'teacher') {
        generateReports();
    } else {
        generateReports(currentUser.username);
    }
});

if(profileLink) profileLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Only teachers can change profile settings
    if (userType === 'teacher') {
        showSection(profileSection);
        // Populate current username
        document.getElementById('current-username').value = currentUser.username;
        // Clear password fields
        document.getElementById('new-username').value = '';
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    } else {
        alert('Students cannot change their login credentials. Please contact administration for assistance.');
    }
});

if(logoutLink) logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem("loggedInUser");
        currentUser = null;
        window.location.href = 'index.html';
    }
});

// Show specific section
function showSection(section) {
    [dashboardSection, attendanceSection, reportsSection, profileSection].forEach(sec => {
        if(sec) sec.classList.add('hidden');
    });
    section.classList.remove('hidden');
}

// Attendance status buttons
document.querySelectorAll('.attendance-status').forEach(statusGroup => {
    const buttons = statusGroup.querySelectorAll('.status-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});

// Class selection
if(classButtons) classButtons.forEach(button => {
    button.addEventListener('click', () => {
        classButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const className = button.getAttribute('data-class');
        document.querySelector('#teacher-attendance .card-title').textContent = `${className} - Section A`;
        
        // Update student list based on class
        updateClassRoster(className);
    });
});

// Simulate different class rosters
function updateClassRoster(className) {
    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = '';
    
    // Different rosters for different classes
    let students = [];
    if (className === 'CS101') {
        students = [
            { id: 'S1001', name: 'John Smith' },
            { id: 'S1002', name: 'Emma Johnson' },
            { id: 'S1003', name: 'Michael Brown' },
            { id: 'S1004', name: 'Sarah Davis' },
            { id: 'S1005', name: 'Robert Wilson' }
        ];
    } else if (className === 'MATH101') {
        students = [
            { id: 'S1001', name: 'John Smith' },
            { id: 'S1006', name: 'Jennifer Lee' },
            { id: 'S1007', name: 'David Miller' },
            { id: 'S1003', name: 'Michael Brown' },
            { id: 'S1008', name: 'Lisa Taylor' }
        ];
    } else {
        // Default roster
        students = [
            { id: 'S1001', name: 'John Smith' },
            { id: 'S1002', name: 'Emma Johnson' },
            { id: 'S1003', name: 'Michael Brown' },
            { id: 'S1004', name: 'Sarah Davis' },
            { id: 'S1005', name: 'Robert Wilson' },
            { id: 'S1006', name: 'Jennifer Lee' },
            { id: 'S1007', name: 'David Miller' },
            { id: 'S1008', name: 'Lisa Taylor' }
        ];
    }
    
    // Populate the table
    students.forEach(student => {
        const row = document.createElement('tr');
        row.setAttribute('data-student', student.id);
        row.setAttribute('data-name', student.name);
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td class="attendance-status">
                <button class="status-btn present active">Present</button>
                <button class="status-btn absent">Absent</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Reattach event listeners to the new buttons
    document.querySelectorAll('.attendance-status').forEach(statusGroup => {
        const buttons = statusGroup.querySelectorAll('.status-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    });
}

// Save attendance (for teachers)
if(saveAttendanceBtn) saveAttendanceBtn.addEventListener('click', () => {
    if (userType !== 'teacher') return;
    saveIndicator.textContent = "Saving...";
    saveIndicator.classList.add('saving');
    saveIndicator.style.display = 'inline-block';
    
    const records = [];
    document.querySelectorAll('#attendance-table tbody tr').forEach(row => {
        const studentId = row.getAttribute('data-student');
        const studentName = row.getAttribute('data-name');
        const status = row.querySelector('.status-btn.active')?.textContent || 'Absent';
        const date = today.toISOString().split('T')[0];
        const className = document.querySelector('#teacher-attendance .card-title').textContent.split(' - ')[0];
        records.push({ studentId, studentName, date, status, className });
    });
    
    let existingRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    existingRecords = existingRecords.concat(records);
    localStorage.setItem("attendanceRecords", JSON.stringify(existingRecords));
    
    setTimeout(() => {
        saveIndicator.textContent = "Attendance Saved!";
        saveIndicator.classList.remove('saving');
        saveIndicator.classList.add('saved');
        setTimeout(() => {
            saveIndicator.style.display = 'none';
            saveIndicator.classList.remove('saved');
        }, 3000);
        updateDashboardStats();
    }, 1000);
});

// Save profile changes (for teachers only)
if(saveProfileBtn) saveProfileBtn.addEventListener('click', () => {
    if (userType !== 'teacher') return;
    
    const currentUsername = document.getElementById('current-username').value;
    const newUsername = document.getElementById('new-username').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate current password
    if (users[currentUsername].password !== currentPassword) {
        alert('Current password is incorrect!');
        return;
    }
    
    // Validate new password confirmation
    if (newPassword && newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    profileSaveIndicator.textContent = "Saving...";
    profileSaveIndicator.classList.add('saving');
    profileSaveIndicator.style.display = 'inline-block';
    
    // Update user data
    if (newUsername && newUsername !== currentUsername) {
        // Create new user entry with updated username
        users[newUsername] = {
            username: newUsername,
            password: newPassword || users[currentUsername].password,
            type: users[currentUsername].type,
            name: users[currentUsername].name
        };
        // Remove old user entry
        delete users[currentUsername];
        
        // Update current user reference
        currentUser = users[newUsername];
        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
        
        // Update displayed username
        document.getElementById('user-name').textContent = newUsername;
        document.getElementById('user-display-name').textContent = newUsername;
        document.getElementById('current-username').value = newUsername;
    } else if (newPassword) {
        // Just update the password
        users[currentUsername].password = newPassword;
    }
    
    // Save updated users to localStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    setTimeout(() => {
        profileSaveIndicator.textContent = "Changes Saved!";
        profileSaveIndicator.classList.remove('saving');
        profileSaveIndicator.classList.add('saved');
        setTimeout(() => {
            profileSaveIndicator.style.display = 'none';
            profileSaveIndicator.classList.remove('saved');
        }, 3000);
    }, 1000);
});

// Load student records
function loadStudentRecords(studentId) {
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    records = records.filter(r => r.studentId === studentId);
    const tbody = document.querySelector('#student-records-table tbody');
    if(tbody) {
        tbody.innerHTML = '';
        records.forEach(r => {
            const row = `<tr>
                <td>${r.date}</td>
                <td>${r.className}</td>
                <td><span class="${r.status.toLowerCase()}" style="padding: 5px 10px; border-radius: 20px;">${r.status}</span></td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

// Generate reports
function generateReports(filterStudent = null) {
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    if (filterStudent) {
        records = records.filter(r => r.studentId === filterStudent);
    }
    const students = [...new Set(records.map(r => r.studentId))];
    const tbody = document.querySelector('#reports-table tbody');
    if(tbody) {
        tbody.innerHTML = '';
        students.forEach(student => {
            const studentRecords = records.filter(r => r.studentId === student);
            const totalClasses = studentRecords.length;
            const present = studentRecords.filter(r => r.status === 'Present').length;
            const absent = studentRecords.filter(r => r.status === 'Absent').length;
            const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;
            
            // Get student name from our users data
            const studentName = users[student]?.name || 'Unknown Student';
            
            const row = `<tr>
                <td>${student}</td>
                <td>${studentName}</td>
                <td>${totalClasses}</td>
                <td>${present}</td>
                <td>${absent}</td>
                <td>${percentage}%</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
    // Hide export buttons for students
    if (userType !== 'teacher') {
        const exportOptions = document.querySelector('.export-options');
        if(exportOptions) exportOptions.style.display = 'none';
    } else {
        const exportOptions = document.querySelector('.export-options');
        if(exportOptions) exportOptions.style.display = 'flex';
    }
}

// Update dashboard stats
function updateDashboardStats() {
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    if (userType !== 'teacher') {
        records = records.filter(r => r.studentId === currentUser.username);
    }
    const totalStudents = new Set(records.map(r => r.studentId)).size;
    const totalClasses = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const overallAttendance = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;
    // For classes this week: simplistic calculation
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const classesThisWeek = records.filter(r => new Date(r.date) >= oneWeekAgo).length;
    
    const totalStudentsEl = document.getElementById('total-students');
    if(totalStudentsEl) totalStudentsEl.textContent = totalStudents;
    const overallAttendanceEl = document.getElementById('overall-attendance');
    if(overallAttendanceEl) overallAttendanceEl.textContent = `${overallAttendance}%`;
    const classesThisWeekEl = document.getElementById('classes-this-week');
    if(classesThisWeekEl) classesThisWeekEl.textContent = classesThisWeek;
}

// Export CSV
if(exportCsvBtn) exportCsvBtn.addEventListener('click', () => {
    if (userType !== 'teacher') return;
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    if (records.length === 0) {
        alert("No records to download!");
        return;
    }
    let csv = "Student ID,Student Name,Date,Class,Status\n";
    records.forEach(r => {
        const studentName = users[r.studentId]?.name || 'Unknown Student';
        csv += `${r.studentId},${studentName},${r.date},${r.className},${r.status}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_records.csv";
    a.click();
});

// Export PDF using jsPDF
if(exportPdfBtn) exportPdfBtn.addEventListener('click', () => {
    if (userType !== 'teacher') return;
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    if (records.length === 0) {
        alert("No records to export!");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add report title
    doc.setFontSize(18);
    doc.text('Attendance Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, 30);
    
    // Prepare data for the table
    const tableData = records.map(r => {
        const studentName = users[r.studentId]?.name || 'Unknown Student';
        return [r.studentId, studentName, r.date, r.className, r.status];
    });
    
    doc.autoTable({
        startY: 40,
        head: [['Student ID', 'Student Name', 'Date', 'Class', 'Status']],
        body: tableData
    });
    doc.save('attendance_records.pdf');
});

// Modal functionality
if(viewAllBtn) viewAllBtn.addEventListener('click', () => {
    scheduleModal.style.display = 'flex';
});

if(closeModalBtn) closeModalBtn.addEventListener('click', () => {
    scheduleModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === scheduleModal) {
        scheduleModal.style.display = 'none';
    }
});
