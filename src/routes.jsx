// src/routes.jsx
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatients from "./pages/admin/Patients";
import ManageAppointments from "./pages/admin/ManageAppointments";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import SubmitReport from "./pages/doctor/SubmitReport";
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import AdminReports from "./pages/admin/Reports";
import DoctorReports from "./pages/doctor/Reports";

const routes = [
  { path: "/login", element: <Login /> },

  // Admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/manage-appointments",
    element: (
      <ProtectedRoute role="admin">
        <ManageAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/doctors",
    element: (
      <ProtectedRoute role="admin">
        <AdminDoctors />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/patients",
    element: (
      <ProtectedRoute role="admin">
        <AdminPatients />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute role="admin">
        <AdminReports />
      </ProtectedRoute>
    ),
  },

  // Doctor
  {
    path: "/doctor",
    element: (
      <ProtectedRoute role="doctor">
        <DoctorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor/appointments",
    element: (
      <ProtectedRoute role="doctor">
        <DoctorAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor/submit-report",
    element: (
      <ProtectedRoute role="doctor">
        <SubmitReport />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor/reports",
    element: (
      <ProtectedRoute role="doctor">
        <DoctorReports />
      </ProtectedRoute>
    ),
  },

  // Patient
  {
    path: "/patient",
    element: (
      <ProtectedRoute role="patient">
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient/book",
    element: (
      <ProtectedRoute role="patient">
        <BookAppointment />
      </ProtectedRoute>
    ),
  },
];

export default routes;