import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { userUsecase } from "../../usecases/user.usecase";
import { v4 as uuidv4 } from "uuid";

export default function AdminPatients() {
  const [patients, setPatients] = React.useState(
    userUsecase.list().filter((u) => u.role === "patient")
  );
  const [show, setShow] = useState(false);

  function addPatient(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const user = {
      id: "pat-" + uuidv4(),
      name: fd.get("name"),
      role: "patient",
      email: fd.get("email"),
    };
    userUsecase.add(user);
    setPatients(userUsecase.list().filter((u) => u.role === "patient"));
    setShow(false);
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Patients</h2>
        <Button
          onClick={() => setShow(true)}
          className={"bg-indigo-600 text-white"}
        >
          Add Patient
        </Button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form onSubmit={addPatient} className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-2">Add Patient</h3>
            <Input name="name" label="Name" />
            <Input name="email" label="Email" />
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