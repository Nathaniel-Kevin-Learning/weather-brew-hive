import DontationButton from './DonationButton';
import Footer from './Footer';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <DontationButton />
    </>
  );
}
