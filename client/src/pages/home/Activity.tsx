import ActivityCard from "./ActivityCard"
import fafimage from "@assets/faf.png"

export default function Activity () {
    return (
        <div className="bg-white rounded-sm p-6">
            <h1 className="font-extrabold mb-4">ACTIVITY</h1>
            <ActivityCard 
                name = "Faf Du Plessis"
                image = {fafimage}
                amount = "540L"
                type = "bid"
                team = "mumbai indians"
            />
            <ActivityCard 
                name = "Faf Du Plessis"
                image = {fafimage}
                amount = "520L"
                type = "bid"
                team = "mumbai indians"
            />
            <ActivityCard 
                name = "Faf Du Plessis"
                image = {fafimage}
                amount = "500L"
                type = "base"
            />
            <ActivityCard 
                name = "Dwayne Brawo"
                image = {fafimage}
                amount = "640L"
                type = "rtm"
                team = "chennai super kings"
            />
            <ActivityCard 
                name = "Dwayne Brawo"
                image = {fafimage}
                amount = "640L"
                type = "sold"
                team = "kings xi punjab"
            />
        </div>
    )
}