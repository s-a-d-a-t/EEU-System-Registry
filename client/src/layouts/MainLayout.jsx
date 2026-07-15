import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return(
        <div>
            <header>
                     NavBar
            </header>

            <main>
                  <Outlet />
            </main>

            <footer>
                    Footer
            </footer>
        </div>
    );
};

export default MainLayout;