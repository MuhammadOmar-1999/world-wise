import Sidebar from "../Components/Sidebar";
import styles from "./AppLayout.module.css";
import Map from "../Components/Map";
import User from "../Components/User";
// import { useAuth } from "../Contexts/AuthContext";
function AppLayout() {
  // const { user } = useAuth();
  return (
    <div className={styles.app}>
      <User />
      <Sidebar />
      <Map />
    </div>
  );
}

export default AppLayout;
