// Menyimpan URL backend API
// Kenapa dibuat variabel?
// Agar jika URL berubah, kita cukup mengubah di satu tempat saja
const API_URL = "http://localhost:5000";

// Mengambil elemen penting dari HTML
const tableBody = document.getElementById("studentTableBody");
const studentForm = document.getElementById("studentForm");
const alertBox = document.getElementById("alertBox");


// ======================================================
// Fungsi untuk menampilkan alert Bootstrap
// ======================================================
function showAlert(message, type) {

    // Membuat elemen alert menggunakan template string
    alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close">
            </button>
        </div>
    `;

    // Menghapus alert otomatis setelah 3 detik
    setTimeout(function () {
        alertBox.innerHTML = "";
    }, 3000);
}


// ======================================================
// Fungsi untuk mengambil semua data mahasiswa
// dari backend API
// ======================================================
function loadStudents() {

    // Mengambil data dari endpoint GET /students
    fetch(`${API_URL}/students`)

        // Mengubah response menjadi JSON
        .then(function (response) {
            return response.json();
        })

        // Menampilkan data ke tabel
        .then(function (students) {

            // Mengosongkan isi tabel sebelum render ulang
            tableBody.innerHTML = "";

            // Melakukan perulangan untuk setiap mahasiswa
            students.forEach(function (student) {

                // Membuat baris tabel baru
                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>${student.grade}</td>
                    </tr>
                `;

                // Menambahkan baris ke dalam tabel
                tableBody.innerHTML += row;
            });
        })

        // Menangani error jika gagal fetch
        .catch(function (error) {

            console.error("Terjadi error:", error);

            showAlert(
                "Gagal mengambil data mahasiswa",
                "danger"
            );
        });
}


// ======================================================
// Fungsi untuk menambah mahasiswa baru
// ======================================================
function addStudent(event) {

    // Mencegah form reload halaman
    event.preventDefault();

    // Mengambil nilai input dari form
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const grade = document.getElementById("grade").value;

    // Membuat object data mahasiswa baru
    const studentData = {
        name: name,
        age: Number(age),
        grade: grade
    };

    // Mengirim data ke backend menggunakan POST
    fetch(`${API_URL}/students`, {

        // Method HTTP POST
        method: "POST",

        // Header agar backend tahu kita mengirim JSON
        headers: {
            "Content-Type": "application/json"
        },

        // Mengubah object JavaScript menjadi JSON string
        body: JSON.stringify(studentData)
    })

        // Mengubah response menjadi JSON
        .then(function (response) {

            // Cek apakah request berhasil
            if (!response.ok) {
                throw new Error("Gagal menambahkan data");
            }

            return response.json();
        })

        // Jika berhasil
        .then(function (data) {

            console.log("Data berhasil ditambahkan:", data);

            // Menampilkan notifikasi sukses
            showAlert(
                "Mahasiswa berhasil ditambahkan",
                "success"
            );

            // Reset form setelah submit berhasil
            studentForm.reset();

            // Reload tabel tanpa refresh halaman
            loadStudents();
        })

        // Menangani error
        .catch(function (error) {

            console.error("Error:", error);

            showAlert(
                "Gagal menambahkan mahasiswa",
                "danger"
            );
        });
}


// ======================================================
// Event listener saat form disubmit
// ======================================================
studentForm.addEventListener("submit", addStudent);


// ======================================================
// Menjalankan loadStudents saat halaman pertama dibuka
// ======================================================
loadStudents();