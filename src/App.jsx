import { Outlet } from "react-router";
import Header from "./layouts/Header/Header";
import Footer from "./layouts/Footer/Footer";

function App() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default App;
