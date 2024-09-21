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
import VoiceToVoice from "./pages/assessments/voceToVoice";

function App() {
  return (
    // later add 'basename="/candidate"' in the browser router tag
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/assessment/:assessmentId/invitation"
          element={ <VerificationPage /> }
        /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<CommonLayout />}>
            <Route
              path="/assessment/:userId/:assessmentId/share-details"
              element={<PersonNeedMoreInfo />}
            />
            <Route
              path="/assessment/:userId/:assessmentId/:testId/coding"
              element={<CodingTest />}
            />
            <Route
              path="/assessment/:userId/:assessmentId/:testId/video-interview"
              element={<VideoTest />}
            />
            <Route
              path="/assessment/:userId/:assessmentId/:testId/voice-to-text"
              element={<VoiceToText />}
            />
            <Route
              path="/assessment/:userId/:assessmentId/:testId/voice-to-voice"
              element={<VoiceToVoice />}
            />
            <Route
              path="/assessment/:userId/:assessmentId/:testId"
              element={<StartMCQTest />}
            />
            <Route
              path="/assessment/:userId/:assessmentId/modules"
              element={<AssessmentDetails />}
            />
            <Route
              path="/assessment/:userId/dashboard"
              element={<MyAssessments />}
            />
            <Route path="/" element={<VerificationPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
