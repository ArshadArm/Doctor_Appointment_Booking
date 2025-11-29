import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { userUsecase } from "../../usecases/user.usecase";
import { v4 as uuidv4 } from "uuid";

export default function AdminDoctors() {
  const [doctors, setDoctors] = React.useState(
    userUsecase.list().filter((u) => u.role === "doctor")
  );
  const [show, setShow] = useState(false);

  function addDoctor(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const user = {
      id: "doc-" + uuidv4(),
      name: fd.get("name"),
      role: "doctor",
      email: fd.get("email"),
      specialization: fd.get("specialization"),
    };
    userUsecase.add(user);
    setDoctors(userUsecase.list().filter((u) => u.role === "doctor"));
    setShow(false);
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