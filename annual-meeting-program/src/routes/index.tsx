// src/routes/index.tsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./layout";
import Loading from "../components/Loading";
const Home = lazy(() => import("../views/Home"));
const Question = lazy(() => import("../views/Question"));
const Result = lazy(() => import("../views/Result"));
const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question/:questionId" element={<Question />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </Layout>
      </Suspense>
    </HashRouter>
  );
};

export default AppRoutes;
