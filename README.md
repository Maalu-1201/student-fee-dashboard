# Student Fee Management Dashboard (Next.js)

## 1. Project Overview

A responsive Next.js (App Router) dashboard for student fee information. It shows total students, total fees, total collected and total pending, plus a student table (name, class, total fee, paid, pending, progress) with name search, a "pending only" filter, sorting by pending amount, and a clear visual difference between fully paid (green) and pending (orange) students. Student data comes from a small backend API (`GET /api/students`). Empty search results, loading and API errors are handled with friendly messages.

## 2. Technologies Used

- Next.js 14 (App Router, Route Handlers) and React 18
- Plain CSS (responsive, no framework)
- JavaScript (ES modules)
- SQL (PostgreSQL syntax) for the database design
- Deployed on Vercel

## 3. Setup and Installation

Requirements: Node.js 18.17 or newer.

```bash
git clone https://github.com/Maalu-1201/student-fee-dashboard.git
cd student-fee-dashboard
npm install
```

## 4. How to Run Locally

```bash
npm run dev          # open http://localhost:3000
npm run test:logic   # checks for the JavaScript problems
npm run build && npm start   # production build
```

## Live Demo

Live URL: Live URL: https://student-fee-dashboard-phi.vercel.app

## Project Structure

```
app/
  layout.jsx               root layout (Server Component)
  page.jsx                 home page (Server Component)
  globals.css              styles
  api/students/route.js    backend API: GET /api/students
components/
  Dashboard.jsx            Client Component: fetch, state, search/filter/sort
  SummaryCards.jsx, Controls.jsx, StudentTable.jsx
lib/feeCalculations.js     pure calculation functions (Problems 1-4)
lib/feeCalculations.check.js  assertions for the functions
data/students.js           data layer used by the API
sql/schema_and_queries.sql schema, queries and explanations
```

## 5. Assumptions and Known Limitations

- The API reads from an in-memory data module (`data/students.js`), not a live database. The data layer is one function (`getStudents`), so it can be replaced by a real database query without changing the frontend.
- Currency is INR and amounts are whole rupees.
- If paid is more than total fee, pending is shown as 0 and the student is "Fully paid".
- There is no authentication and no create/update API (read-only).
- Only logic checks are automated. There are no UI tests.

## 6. Answers: JavaScript and Logic Questions

**Problem 1: calculatePending** is in `lib/feeCalculations.js`.
`calculatePending(5000, 3000)` returns 2000 and `calculatePending(4000, 4000)` returns 0.
_Paid amount greater than total fee:_ the function returns `Math.max(total - paid, 0)`, so pending is never negative. The extra money is available through `getOverpaid()` so it can be treated as a credit or refund instead of being lost. Invalid input (negative or non-number) throws an error.

**Problem 2: Filter students:** `filterPendingStudents(students)` returns only students whose pending amount is greater than 0.

**Problem 3: Totals:** `calculateTotals(students)` returns total students, total fees (23,500), total collected (11,500) and total pending (12,000) for the sample data.

**Problem 4: Highest pending:** `findHighestPending(students)` returns the student with the largest pending fee (Rahul Patel, 3,500 for the sample data) and `null` for an empty list.

**Problem 5: Installments without double counting.**
Store every installment as its own row with a unique id (the `payments` table) and never keep a separate "paid" number that is also added on top. Then total collected is simply the sum of `amount` over all payment rows, and per student it is `SUM(amount) GROUP BY student_id`. Because each installment exists exactly once, nothing is counted twice. To protect against duplicate entries (for example a form submitted twice), keep the unique primary key and optionally a unique receipt or transaction reference. In JavaScript the same idea is a `Set` of payment ids while summing.

## 7. Answers: SQL and Database Fundamentals

Full file: `sql/schema_and_queries.sql`

```sql
-- Retrieve all students
SELECT * FROM students;

-- All payments made by a particular student
SELECT * FROM payments WHERE student_id = 1 ORDER BY payment_date;

-- Total amount paid by each student
SELECT student_id, SUM(amount) AS total_paid FROM payments GROUP BY student_id;

-- Every student with total paid, including students with no payments
SELECT s.id, s.name, COALESCE(SUM(p.amount), 0) AS total_paid
FROM students s
LEFT JOIN payments p ON p.student_id = s.id
GROUP BY s.id, s.name;

-- Students whose total payments exceed 5000
SELECT s.id, s.name, SUM(p.amount) AS total_paid
FROM students s JOIN payments p ON p.student_id = s.id
GROUP BY s.id, s.name
HAVING SUM(p.amount) > 5000;

-- Total collected in a given month (February 2026)
SELECT COALESCE(SUM(amount), 0) AS month_total
FROM payments
WHERE payment_date >= DATE '2026-02-01' AND payment_date < DATE '2026-03-01';
```

**INNER JOIN vs LEFT JOIN:** INNER JOIN returns only rows that have a match in both tables, so a student with no payments disappears. LEFT JOIN returns every row from the left table, and where there is no match the right-side columns are NULL. That is why the LEFT JOIN query above still lists students who have not paid anything.

**Why a foreign key is useful:** `payments.student_id` references `students.id`. This guarantees a payment cannot belong to a student that does not exist, stops deleting a student who still has payments (unless cascade is chosen), documents the relationship, and helps the database optimise joins.

**Proposed schema:**

```sql
CREATE TABLE students (
    id        INTEGER PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    class     VARCHAR(10)  NOT NULL,
    total_fee DECIMAL(10,2) NOT NULL CHECK (total_fee >= 0)
);

CREATE TABLE payments (
    id           INTEGER PRIMARY KEY,
    student_id   INTEGER NOT NULL REFERENCES students(id),
    amount       DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL
);
```

_Multiple payments by the same student:_ this is a one-to-many relationship. One student can have many rows in `payments`, one per installment. Paid amount is always calculated as `SUM(payments.amount)`, and pending is `total_fee - paid`. Indexes on `student_id` and `payment_date` keep lookups and monthly reports fast.

## 8. Bonus B: Vercel Deployment

1. Push the repo to GitHub.
2. On vercel.com choose Add New, Project, import the repo (Next.js is auto-detected).
3. Click Deploy. Every push to `main` redeploys automatically.

Live URL: student-fee-dashboard-phi.vercel.app

## 9. AI Usage Disclosure

I used Claude (AI assistant) to help plan the project and generate the initial code, SQL and README draft. I set up and ran the project locally, tested all features, fixed issues while pushing to GitHub and deploying, made the commits, and deployed the app on Vercel. I reviewed the code and can explain each part.
