import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Navbar from './pages/navbar/Navbar'
import MyTeam from './pages/home/MyTeam'
import Bid from './pages/home/Bid'

export default function App() {
	return (
		<BrowserRouter>
			
			<Routes>
				<Route path="/" element={<Bid />} />
				<Route path='/my-team' element={<MyTeam />} />
			</Routes>
		</BrowserRouter>
	)
}
