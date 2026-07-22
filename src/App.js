import React, { useState, useMemo } from "react";
import "./App.css";

// Reusable Search Hook
function useSearch(data, search) {
  return useMemo(() => {
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);
}

function App() {
  const [employees, setEmployees] = useState([
    {
      id: 101,
      name: "Vinay",
      position: "Developer",
      department: "IT",
    },
    {
      id: 102,
      name: "Praveen",
      position: "Designer",
      department: "Design",
    },
    {
      id: 103,
      name: "Swetha",
      position: "Manager",
      department: "HR",
    },
    {
      id: 104,
      name: "Giri",
      position: "Tester",
      department: "IT",
    },
  ]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // New Employee Form
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    position: "",
    department: "",
  });

  const itemsPerPage = 3;

  // Search
  const searchedEmployees = useSearch(employees, search);

  // Filter
  const filteredEmployees = searchedEmployees.filter((employee) => {
    return department === "All" || employee.department === department;
  });

  // Pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentEmployees = filteredEmployees.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    filteredEmployees.length / itemsPerPage
  );

  // Add Employee
  const addEmployee = (e) => {
    e.preventDefault();

    if (
      !newEmployee.id ||
      !newEmployee.name ||
      !newEmployee.position ||
      !newEmployee.department
    ) {
      alert("Please fill all fields");
      return;
    }

    setEmployees([...employees, newEmployee]);

    setNewEmployee({
      id: "",
      name: "",
      position: "",
      department: "",
    });

    setCurrentPage(1);
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmDelete) {
      setEmployees(
        employees.filter((employee) => employee.id !== id)
      );

      setCurrentPage(1);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["ID", "Name", "Position", "Department"];

    const rows = filteredEmployees.map((employee) => [
      employee.id,
      employee.name,
      employee.position,
      employee.department,
    ]);

    const csvData = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">

      <h1>Employee Management</h1>

      {/* Add Employee Form */}
      <form className="add-form" onSubmit={addEmployee}>
        <input
          type="number"
          placeholder="Employee ID"
          value={newEmployee.id}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              id: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Position"
          value={newEmployee.position}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              position: e.target.value,
            })
          }
        />

        <select
          value={newEmployee.department}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              department: e.target.value,
            })
          }
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Design">Design</option>
        </select>

        <button type="submit">
          Add Employee
        </button>
      </form>

      {/* Search and Filter */}
      <div className="controls">

        <input
          type="text"
          placeholder="Search ID, name, position..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Design">Design</option>
        </select>

        <button onClick={exportCSV}>
          Export CSV
        </button>

      </div>

      {/* Employee Table */}
      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {currentEmployees.length > 0 ? (

            currentEmployees.map((employee) => (

              <tr key={employee.id}>

                <td>{employee.id}</td>

                <td>{employee.name}</td>

                <td>{employee.position}</td>

                <td>{employee.department}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteEmployee(employee.id)
                    }
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="5">
                No employees found
              </td>
            </tr>

          )}

        </tbody>

      </table>

      {/* Pagination */}
      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default App;