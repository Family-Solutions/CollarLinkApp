import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import MainLayout from "./components/mainlayout";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Mascotas from "./pages/mascotas";
import Dispositivos from "./pages/dispositivos";
import Geocercas from "./pages/geocercas";

import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

// Componente para proteger el Layout principal
const ProtectedLayout = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <MainLayout />;
};

function App() {
    useEffect(() => {
        const platform = Capacitor.getPlatform();

        // Solo ejecuta la lógica de notificaciones si es iOS o Android
        if (platform === "android" || platform === "ios") {
            LocalNotifications.requestPermissions();

            const interval = setInterval(async () => {
                try {
                    console.log("funcionando0");
                    const res = await fetch(
                        "https://notificacionapi.onrender.com/estado"
                    );
                    console.log("funcionando1");
                    const valor = await res.text();
                    console.log("funcionando2");
                    if (valor === "1") {
                        console.log("funcionando3");
                        await LocalNotifications.schedule({
                            notifications: [
                                {
                                    id: Date.now(),
                                    title: "🔔 Alerta de CollarLink",
                                    body: "El su mascota ha salido de la geocerca.",
                                    schedule: { at: new Date() },
                                },
                            ],
                        });
                    }
                } catch (error) {
                    console.error("Error al consultar la API:", error);
                }
            }, 10000);

            return () => clearInterval(interval);
        }
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Rutas públicas (Login y Register) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas protegidas que usan el MainLayout */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/mascotas" element={<Mascotas />} />
                        <Route
                            path="/dispositivos"
                            element={<Dispositivos />}
                        />
                        <Route path="/geocercas" element={<Geocercas />} />
                    </Route>

                    {/* Redirección por defecto */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
