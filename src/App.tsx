import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyAssessments from './pages/assessments/list';
import PrivateRoute from './PrivateRoute';
import CommonLayout from './layouts/common';
import AssessmentDetails from './pages/assessments/details';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <PrivateRoute /> }>
          <Route path="/" element={ <CommonLayout /> }>
            <Route path="/assessment/:assessmentId" element={ <AssessmentDetails /> } />
            <Route path="/" element={ <MyAssessments /> } />
          </Route>
        </Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App;
