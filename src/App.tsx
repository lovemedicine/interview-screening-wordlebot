import { Container, Box } from "@mui/material";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Game from "./components/Game";

function App() {
    return (
        <Layout>
            <Container maxWidth="sm" sx={{ textAlign: "center" }}>
                <Header />
                <Game />
            </Container>
        </Layout>
    );
}

export default App;
