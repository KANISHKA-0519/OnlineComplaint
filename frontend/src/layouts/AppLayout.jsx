import Navbar from "../components/Navbar";
import { theme } from "../utils/theme";

const AppLayout = ({ children }) => {
  return (
    <div className={theme.pageBg}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
};

export default AppLayout;
