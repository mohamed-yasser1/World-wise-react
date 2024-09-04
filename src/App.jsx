import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { CitiesProvider } from "./contexts/CitiesContext.jsx";
import { AuthProvider } from "./contexts/FakeAuthContext.jsx";
import ProtectRoutes from "./contexts/ProtectRoutes.jsx";

import Layout from "./components/Layout/Layout";
import CityList from "./components/CityList/CityList.jsx";
import CountryList from "./components/CountryList/CountryList.jsx";
import City from "./components/City/City.jsx";
import Form from "./components/Form/Form.jsx";
import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage.jsx";

const HomePage = lazy(() => import("./pages/HomePage/Homepage.jsx"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing.jsx"));
const Product = lazy(() => import("./pages/Product/Product.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const NotFound = lazy(() => import("./components/NotFound/NotFound.jsx"));
const AppLayout = lazy(() => import("./pages/AppLayout/AppLayout.jsx"));

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "pricing", element: <Pricing /> },
        { path: "product", element: <Product /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/app",
      element: (
        <ProtectRoutes>
          <AppLayout />
        </ProtectRoutes>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={"cities"} replace />,
        },
        {
          path: "cities",
          element: <CityList />,
        },
        { path: "cities/:id", element: <City /> },
        {
          path: "countries",
          element: <CountryList />,
        },
        { path: "form", element: <Form /> },
      ],
    },
  ]);

  return (
    <CitiesProvider>
      <AuthProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <RouterProvider router={router}></RouterProvider>
        </Suspense>
      </AuthProvider>
    </CitiesProvider>
  );
}

export default App;
