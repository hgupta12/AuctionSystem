import logo from "../../assets/ipllogo.png"
import { useNavigate } from 'react-router-dom'

interface ListProps {
    icon: string,
    text: string,
    active: boolean,
    route: string
}

export default function Navbar () {
    return (
        <div className="bg-white fixed top-0 left-0 h-svh p-16">
            <img src={logo} alt="" className="w-32" />
            <h1 className="text-yellow-400 text-xl font-bold text-center max-w-32">AUCTION SIMULATOR </h1>

            <div className="absolute bottom-0 left-0 w-full">
                <ListItem
                    text = "Auction"
                    icon = "payments"
                    active = {true}
                    route = '/'
                />
                <ListItem
                    text = "Players"
                    icon = "sports_cricket"
                    active = {false}
                    route = '/all-players'
                />
                <ListItem
                    text = "My Team"
                    icon = "stacks"
                    active = {false}
                    route = '/my-team'
                />
            </div>
        </div>
    )
}

function ListItem ({ icon, text, active, route } : ListProps) {
    const navigate = useNavigate()
    return (
        <li className={`flex gap-3 items-center ${active ? "text-blue-500 bg-gray-200" : "text-gray-600"} hover:bg-gray-200 duration-300 cursor-pointer py-5 pl-5 uppercase`}
        onClick={() => navigate(route)}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <p className={`text-lg ${active ? "font-bold" : ""}`}>{text }</p>
        </li>
    )
}