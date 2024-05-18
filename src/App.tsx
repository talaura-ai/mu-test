import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyAssessments from './pages/assessments/list';
import PrivateRoute from './PrivateRoute';
import CommonLayout from './layouts/common';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <PrivateRoute /> }>
          <Route path="/" element={ <CommonLayout /> }>
            <Route path="/" element={ <MyAssessments /> } />
          </Route>
        </Route>
        <Route path="" element={ <MyAssessments /> } />
      </Routes >
    </BrowserRouter >
  );
}

export default App;
