import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import { ClientOnly } from "./components/ClientOnly";
import { RegisterModal } from "./components/modal/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import { LoginModal } from "./components/modal/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modal/RentModal";
export const metadata = {
	title: "Airbnb",
	description: "Airbnb clone",
};

const font = Nunito({
	subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const currentUser = await getCurrentUser();
	return (
		<html lang='en'>
			<body className={font.className}>
				<ClientOnly>
					<ToasterProvider></ToasterProvider>
					<RegisterModal></RegisterModal>
					<RentModal></RentModal>
					<LoginModal></LoginModal>
					<Navbar currentUser={currentUser}></Navbar>
				</ClientOnly>
				{children}
			</body>
		</html>
	);
}
