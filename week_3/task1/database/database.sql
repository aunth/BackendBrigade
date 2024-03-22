CREATE DATABASE EHMS;

-- Create Departments table
CREATE TABLE Departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    max_consecutive_days INT NOT NULL
);

CREATE TABLE BlackoutPeriods (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES Departments(id),
    blackout_start_date TIMESTAMP NOT NULL,
    blackout_end_date TIMESTAMP NOT NULL
);

-- Create Employees table
CREATE TABLE Employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    country VARCHAR(2) NOT NULL,
    remaining_holidays INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE SET NULL
);

-- Create Holidays table
CREATE TABLE Requests (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE
);

--INSERT INTO Departments (name, max_consecutive_days)
--VALUES 
--('IT', 10),
--('HR', 12),
--('FINANCE', 15),
--('MARKETING', 8),
--('SALES', 7);
--
--INSERT INTO BlackoutPeriods (department_id, blackout_start_date, blackout_end_date)
--VALUES (1, '2024-03-14', '2024-03-16'),
--(2, '2024-07-01', '2024-07-15'),
--(3, '2024-03-01', '2024-03-15'),
--(4, '2024-05-01', '2024-05-07'),
--(5, '2024-10-01', '2024-10-07');
--
--INSERT INTO Employees (name, department_id, country, remaining_holidays) VALUES
--('John Doe', (SELECT id FROM Departments WHERE name = 'IT'), 'UA', 8),
--('Jane Smith', (SELECT id FROM Departments WHERE name = 'HR'), 'IT', 29),
--('John Smith', (SELECT id FROM Departments WHERE name = 'HR'), 'UA', 15);
--
--INSERT INTO Requests (employee_id, start_date, end_date, status) VALUES
--(1, '2024-04-01T00:00:00.000Z', '2024-04-05T00:00:00.000Z', 'pending'),
--(1, '2024-03-01T00:00:00.000Z', '2024-03-02T00:00:00.000Z', 'approved'),
--(2, '2024-03-02T00:00:00.000Z', '2024-03-03T00:00:00.000Z', 'rejected'),
--(2, '2024-03-03T00:00:00.000Z', '2024-03-04T00:00:00.000Z', 'pending');

