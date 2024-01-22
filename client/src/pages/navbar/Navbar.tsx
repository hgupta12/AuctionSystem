import logo from "../../assets/ipllogo.png"

export default function Navbar () {
    return (
        <div className="bg-white fixed top-0 left-0 h-svh p-16">
            <img src={logo} alt="" className="w-32" />
            <h1 className="text-yellow-400 font-bold text-center">AUCTIONS 2018</h1>

            <div className="absolute bottom-0 left-0 w-full">
                <ListItem
                    text = "Auction"
                    icon = "payments"
                    active = {true}
                />
                <ListItem
                    text = "Players"
                    icon = "sports_cricket"
                    active = {false}
                />
                <ListItem
                    text = "My Team"
                    icon = "stacks"
                    active = {false}
                />
            </div>
        </div>
    )
}

function ListItem ({ icon, text, active } : { icon: string, text: string, active: boolean }) {
    return (
        <li className={`flex gap-3 items-center ${active ? "text-blue-500 bg-gray-200" : "text-gray-600"} hover:bg-gray-200 duration-300 cursor-pointer py-5 pl-5 uppercase`}>
            <span className="material-symbols-outlined">{icon}</span>
            <p className={`text-lg ${active ? "font-bold" : ""}`}>{ text }</p>
        </li>
    )
}