import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatients from "./pages/admin/Patients";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const routes = [
  { path: "/login", element: <Login /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute role={"admin"}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/doctors",
    element: (
      <ProtectedRoute role={"admin"}>
        <AdminDoctors />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/patients",
    element: (
      <ProtectedRoute role={"admin"}>
        <AdminPatients />
      </ProtectedRoute>
    ),
  },

  {
    path: "/doctor",
    element: (
      <ProtectedRoute role={"doctor"}>
        <DoctorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor/appointments",
    element: (
      <ProtectedRoute role={"doctor"}>
        <DoctorAppointments />
      </ProtectedRoute>
    ),
  },

  {
    path: "/patient",
    element: (
      <ProtectedRoute role={"patient"}>
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient/book",
    element: (
      <ProtectedRoute role={"patient"}>
        <BookAppointment />
      </ProtectedRoute>
    ),
  },
];

export default routes;