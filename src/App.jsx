import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { CitiesProvider } from "./Contexts/CitiesContext";
import { AuthProvider } from "./Contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CityList from "./Components/CityList";
import CountryList from "./Components/CountryList";
import City from "./Components/City";
import Form from "./Components/Form";
import SpinnerFullPage from "./Components/SpinnerFullPage";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";
// import PageNotFound from "./pages/PageNotFound";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <CitiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                {/* <Route index element={<CityList cities={cities} isLoading={isLoading} />} */}
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="cities" element={<CityList />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </CitiesProvider>
  );
}

export default App;

//npm run build -> to create a bundle of the application

//bundle before implementing lazy loading
/*
dist/index.html                   0.47 kB │ gzip:   0.31 kB
dist/assets/icon-98c6b6d7.png    20.20 kB
dist/assets/index-b883a2fb.css   31.91 kB │ gzip:   5.27 kB
dist/assets/index-3df56f32.js   533.14 kB │ gzip: 150.62 kB
*/

//bundle after implmenting lazy loading
/*
dist/index.html                           0.47 kB │ gzip:   0.31 kB
dist/assets/icon-98c6b6d7.png            20.20 kB
dist/assets/Logo-515b84ce.css             0.03 kB │ gzip:   0.05 kB
dist/assets/Login-f39ef3ff.css            0.35 kB │ gzip:   0.22 kB
dist/assets/Product-cf1be470.css          0.47 kB │ gzip:   0.27 kB
dist/assets/Homepage-b9276e6f.css         0.51 kB │ gzip:   0.30 kB
dist/assets/PageNav-c4cc2158.css          0.51 kB │ gzip:   0.28 kB
dist/assets/AppLayout-5e6cff00.css        1.91 kB │ gzip:   0.70 kB
dist/assets/index-2ee5ddc5.css           28.24 kB │ gzip:   4.59 kB
dist/assets/Product.module-02d70b80.js    0.06 kB │ gzip:   0.07 kB
dist/assets/PageNotFound-9499d69e.js      0.15 kB │ gzip:   0.15 kB
dist/assets/Logo-302b968e.js              0.21 kB │ gzip:   0.19 kB
dist/assets/PageNav-5602e836.js           0.49 kB │ gzip:   0.27 kB
dist/assets/Pricing-34af1f92.js           0.65 kB │ gzip:   0.41 kB
dist/assets/Homepage-d31d1a70.js          0.67 kB │ gzip:   0.43 kB
dist/assets/Product-74fe154f.js           0.86 kB │ gzip:   0.49 kB
dist/assets/Login-0d394b52.js             1.02 kB │ gzip:   0.54 kB
dist/assets/AppLayout-ca8018da.js       157.00 kB │ gzip:  46.17 kB
dist/assets/index-7fa6742f.js           374.52 kB │ gzip: 103.99 kB
*/
