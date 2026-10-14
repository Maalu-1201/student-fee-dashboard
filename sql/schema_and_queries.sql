-- ============================================================
-- Student Fee Management: schema + queries (PostgreSQL syntax)
-- ============================================================

-- ---------- Proposed schema ----------
CREATE TABLE students (
    id          INTEGER PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    class       VARCHAR(10)  NOT NULL,
    total_fee   DECIMAL(10,2) NOT NULL CHECK (total_fee >= 0)   -- fee assigned to the student
);

CREATE TABLE payments (
    id            INTEGER PRIMARY KEY,
    student_id    INTEGER NOT NULL REFERENCES students(id),
    amount        DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_date  DATE NOT NULL
);
-- One student -> many payments (one-to-many). Every installment is its own row,
-- so paid amount is always SUM(payments.amount); nothing is stored twice.
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- ---------- Sample data ----------
INSERT INTO students VALUES
 (1,'Aman Sharma','10',5000),(2,'Priya Verma','9',4000),(3,'Rahul Patel','10',6000),
 (4,'Neha Singh','8',3000),(5,'Rohan Das','9',5500);
INSERT INTO payments VALUES
 (1,1,2000,'2026-01-05'),(2,1,1000,'2026-02-05'),(3,2,4000,'2026-01-10'),
 (4,3,2500,'2026-02-12'),(5,5,2000,'2026-02-20');

-- ---------- Queries ----------
-- 1. All students
SELECT * FROM students;

-- 2. All payments by one student (id = 1)
SELECT * FROM payments WHERE student_id = 1 ORDER BY payment_date;

-- 3. Total paid by each student (only students with payments)
SELECT student_id, SUM(amount) AS total_paid
FROM payments
GROUP BY student_id;

-- 4. Every student with total paid, including those with no payments
SELECT s.id, s.name, COALESCE(SUM(p.amount), 0) AS total_paid
FROM students s
LEFT JOIN payments p ON p.student_id = s.id
GROUP BY s.id, s.name;

-- 5. Students whose total payments exceed 5000
SELECT s.id, s.name, SUM(p.amount) AS total_paid
FROM students s
JOIN payments p ON p.student_id = s.id
GROUP BY s.id, s.name
HAVING SUM(p.amount) > 5000;

-- 6. Total collected in a given month (example: February 2026)
SELECT COALESCE(SUM(amount), 0) AS month_total
FROM payments
WHERE payment_date >= DATE '2026-02-01'
  AND payment_date <  DATE '2026-03-01';   -- range check can use the date index

-- Bonus: pending fee per student
SELECT s.id, s.name, s.total_fee,
       COALESCE(SUM(p.amount), 0) AS paid,
       GREATEST(s.total_fee - COALESCE(SUM(p.amount), 0), 0) AS pending
FROM students s
LEFT JOIN payments p ON p.student_id = s.id
GROUP BY s.id, s.name, s.total_fee;

-- ---------- Explanations ----------
-- INNER JOIN returns only rows with a match in both tables. A student with no
-- payments would disappear from the result.
-- LEFT JOIN returns every row from the left table; where there is no match the
-- right-side columns are NULL. That is why query 4 shows students with 0 payments.
--
-- A foreign key (payments.student_id -> students.id) enforces referential
-- integrity: you cannot record a payment for a student that does not exist, and
-- you cannot delete a student who still has payments (unless cascade is set).
-- It also documents the relationship and helps the DB optimise joins.
