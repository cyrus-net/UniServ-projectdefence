import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { About } from "./pages/About";
import { HowItWorks } from "./pages/HowItWorks";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ComingSoon } from "./pages/ComingSoon";
import { ErrorPage } from "./pages/ErrorPage";

// Client (Find Services) pages
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ExploreServices } from "./pages/client/ExploreServices";
import { ServiceDetails } from "./pages/client/ServiceDetails";
import { MyBookings } from "./pages/client/MyBookings";
import { BookingDetails } from "./pages/client/BookingDetails";
import { ClientProfile } from "./pages/client/ClientProfile";

// Seller (Offer Services) pages
import { SellerDashboard } from "./pages/seller/SellerDashboard";
import { MyServices } from "./pages/seller/MyServices";
import { AddService } from "./pages/seller/AddService";
import { BookingsManagement } from "./pages/seller/BookingsManagement";
import { Earnings } from "./pages/seller/Earnings";
import { SellerProfile } from "./pages/seller/SellerProfile";
import { RequireAuth } from "./components/RequireAuth";

// Shared pages
import { Notifications } from "./pages/shared/Notifications";
import { Settings } from "./pages/shared/Settings";
import { Messages } from "./pages/shared/Messages";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Landing },
      { path: "sign-in", Component: SignIn },
      { path: "sign-up", Component: SignUp },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "about", Component: About },
      { path: "how-it-works", Component: HowItWorks },
      { path: "coming-soon", Component: ComingSoon },
      
      // Client routes
      { path: "client/dashboard", Component: ClientDashboard },
      { path: "client/explore", Component: ExploreServices },
      { path: "client/service/:id", Component: ServiceDetails },
      { path: "client/bookings", Component: MyBookings },
      { path: "client/booking/:id", Component: BookingDetails },
      { path: "client/profile", Component: ClientProfile },
      
      {
        path: "seller",
        Component: RequireAuth,
        children: [
          { path: "dashboard", Component: SellerDashboard },
          { path: "services", Component: MyServices },
          { path: "add-service", Component: AddService },
          { path: "bookings", Component: BookingsManagement },
          { path: "earnings", Component: Earnings },
          { path: "profile", Component: SellerProfile },
        ],
      },
      
      // Shared routes
      { path: "notifications", Component: Notifications },
      { path: "settings", Component: Settings },
      { path: "messages", Component: Messages },
      
      { path: "*", Component: NotFound },
    ],
  },
]);
