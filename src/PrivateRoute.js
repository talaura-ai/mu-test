import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute () {
  const token = localStorage.getItem("a2z-crs-token");
  return (
    true ? <Outlet /> : <Navigate to='/' />
  )
}
