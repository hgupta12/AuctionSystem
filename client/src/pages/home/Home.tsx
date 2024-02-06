import Activity from "./Activity";
import Teams from "./Teams";

export default function Home () {
    return (
        <div className="h-screen p-4 ml-64">
            <div className="grid grid-cols-homegrid grid-rows-homegrid gap-4">
                <div className="col-span-2"></div>
                <Teams />
                <Activity />
            </div>
        </div>
    )
}