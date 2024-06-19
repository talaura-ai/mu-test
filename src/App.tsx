import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyAssessments from "./pages/assessments/list";
import PrivateRoute from "./PrivateRoute";
import CommonLayout from "./layouts/common";
import AssessmentDetails from "./pages/assessments/details";
import StartMCQTest from "./pages/assessments/mcqTest";
import CodingTest from "./pages/assessments/codingTest";
import VideoTest from "./pages/assessments/videoTest";
import VerificationPage from "./pages/verificationPage";
import PersonNeedMoreInfo from "./pages/assessments/needMoreInfo";
import VoiceToText from "./pages/assessments/voiceToText";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/assessment/:assessmentId/invitation"
          element={<VerificationPage />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<CommonLayout />}>
            <Route
              path="/assessment/:assessmentId/:testId"
              element={<StartMCQTest />}
            />
            <Route
              path="/assessment/:assessmentId/share-details"
              element={<PersonNeedMoreInfo />}
            />
            <Route
              path="/assessment/:assessmentId"
              element={<AssessmentDetails />}
            />
            <Route
              path="/assessment/:assessmentId/coding"
              element={<CodingTest />}
            />
            <Route
              path="/assessment/:assessmentId/video"
              element={<VideoTest />}
            />
            <Route
              path="/assessment/:assessmentId/voice-to-text"
              element={<VoiceToText />}
            />
            <Route path="/" element={<MyAssessments />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
