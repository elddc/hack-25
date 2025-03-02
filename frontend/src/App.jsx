import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter, Route, Routes} from "react-router";
import Chat from "./pages/Chat";
import Error404 from "./pages/errors/Error404";
import Dashboard from "./pages/Dashboard";

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Button: {
            variants: {
                outline: {
                    borderWidth: "2px"
                },
            },
        }
    },
})

function App() {
    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    )
}

export default App
