import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chats from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import ChatInbox from "./pages/Chats";
import ChatsListView from "./pages/Chats/components/ChatsListView";
import UsersListView from "./pages/Users";
import * as Sentry from "@sentry/react";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Chats />}>
              <Route path="" element={<Navigate to="chats" />} />
              <Route path="chats" element={<ChatsListView />}>
                <Route path=":id" element={<ChatInbox />} />
              </Route>
              <Route path="users" element={<UsersListView />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Sentry.withProfiler(App);
