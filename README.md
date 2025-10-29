# Paymora — Payroll Management System

> A modern, lightweight, and flexible **Payroll Management Web Application**.
> Paymora streamlines **employee attendance tracking, payroll calculation, and payslip generation** — all in one place.

---

## Tech Stack

**Frontend**

- [React 19](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/) (Radix-based UI components)
- [React Hook Form + Zod](https://react-hook-form.com/) for form handling and validation
- [Recharts](https://recharts.org/en-US/) for data visualization
- [React Router DOM](https://reactrouter.com/) for routing
- [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- [CRACO](https://github.com/dilanx/craco) for extended CRA configuration

**Backend**

- [FastAPI](https://fastapi.tiangolo.com/)
- PostgreSQL (via SQLAlchemy ORM)
- [ReportLab](https://www.reportlab.com/) for generating payslip PDFs

---

## Core Features

**Employee Management**
Easily add, update, or remove employee records with personal and job details.

**Attendance Tracking**
Record time-in/time-out, overtime, undertime, and night differential automatically.

**Payroll Processing**
Compute gross pay, deductions, and net pay based on attendance and configured rates.

**Payslip Generation**
Instantly generate and download PDF payslips using ReportLab.

**User Roles**
Admin and Employee access levels.

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/andresdaryl/peyrol.git
cd peyrol
```

### 2️⃣ Install dependencies

Using **Yarn** (recommended):

```bash
yarn install
```

### 3️⃣ Run the development server

```bash
yarn start
```

The app will run at [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

`.env.example` example:

```
REACT_APP_API_URL=http://localhost:8000
```

---

## Author

**Daryl ([@andresdaryl](https://github.com/andresdaryl))**
Full-Stack Developer.

---

## License

This project is licensed under the **MIT License**.
Feel free to use and modify with proper attribution.
