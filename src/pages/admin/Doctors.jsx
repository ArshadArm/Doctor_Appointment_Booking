// src/pages/admin/Doctors.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { userUsecase } from "../../usecases/user.usecase";
import { v4 as uuidv4 } from "uuid";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";
import { required } from "../../utils/validators";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);

  async function load() {
    const list = await userUsecase.list();
    setDoctors(list.filter((u) => u.role === "doctor"));
  }

  useEffect(() => {
    load();
    window.addEventListener("dab_db_change", load);
    return () => window.removeEventListener("dab_db_change", load);
  }, []);

  async function addDoctor(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name");
    const email = fd.get("email");
    const specialization = fd.get("specialization");

    if (!required(name) || !required(email))
      return notifyError("Name and email required");
    const user = {
      id: "doc-" + uuidv4(),
      name,
      role: "doctor",
      email,
      specialization,
      password: "doctor123", // default for demo
    };
    try {
      await userUsecase.add(user);
      notifySuccess("Doctor added");
      setShow(false);
      load();
    } catch (e) {
      console.error(e);
      notifyError("Failed to add doctor");
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Doctors</h2>
        <Button
          onClick={() => setShow(true)}
          className={"bg-indigo-600 text-white"}
        >
          Add Doctor
        </Button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th>Email</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form onSubmit={addDoctor} className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-2">Add Doctor</h3>
            <Input name="name" label="Name" />
            <Input name="email" label="Email" />
            <Input name="specialization" label="Specialization" />
            <div className="mt-3 flex justify-end gap-2">
              <Button type="button" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white">
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}