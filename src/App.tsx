import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyAssessments from './pages/assessments/my-assessments';
import PrivateRoute from './PrivateRoute';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <PrivateRoute /> }>
          {/* <Route path="/admin/" element={ <AdminLayout /> }> */ }
          <Route path="blogs/add-blog" element={ <MyAssessments /> } />
          <Route path="*" element={ <MyAssessments /> } />
          {/* </Route> */ }
        </Route>
        <Route path="" element={ <MyAssessments /> } />
      </Routes >
    </BrowserRouter >
  );
}

export default App;
