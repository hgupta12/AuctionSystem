import TeamCard from "./TeamCard"
import csklogo from "../../assets/csklogo.png"

export default function Teams () {
    return (
        <div className="bg-white w-3/5 h-1/2 rounded-sm p-6">
            <h1 className="font-extrabold mb-6">TEAMS OVERVIEW</h1>
            <div className="grid grid-cols-4 gap-4">
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
                <TeamCard
                    image = {csklogo}
                    funds = {"17.00cr"}
                    players = {11}
                />
            </div>
        </div>
    )
}