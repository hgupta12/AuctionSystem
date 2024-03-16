import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Navbar from './pages/navbar/Navbar'
import MyTeam from './pages/home/MyTeam'

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path='/my-team' element={<MyTeam />} />
			</Routes>
		</BrowserRouter>
	)
}
