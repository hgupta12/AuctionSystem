interface Args {
    name: String;
    image: string;
    amount: String;
    type: "bid" | "base" | "rtm" | "sold";
    team?: String;
}

export default function ActivityCard ({ name, amount, type, team = "", image } : Args) {

    let amount_title
    if (type == "bid" || type == "sold") amount_title = "current bid"
    else if (type == "rtm") amount_title = "matched bid"
    else amount_title = "base price"

    let activity_title
    if (type == "bid") activity_title = "bid by"
    else if (type == "sold") activity_title = "sold to"
    else if (type == "rtm") activity_title = "rtm by"
    else activity_title = "player on auction"


    return (
        <div className="bg-neutral-100 px-4 py-3 flex justify-between border-b-4 my-3">
            <div className="flex flex-col gap-2">
                <h2 className="uppercase text-slate-500 text-xs font-semibold">{activity_title} {team}</h2>
                <div className="flex align-middle gap-2">
                    <img src={image} alt=""  className="w-6 h-6 rounded-full"/>
                    {name}
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <h2 className="uppercase text-slate-500 text-xs font-semibold">{amount_title}</h2>
                <p className="text-lg">{amount}</p>
            </div>
        </div>
    )
}