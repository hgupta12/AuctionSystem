interface Args {
    name: string,
    team: string,
    price: string
}
export default function PlayerCard({ name, team, price, image } : Args) {
    return (
        <>
        <div className="bg-white px-4 py-3 flex h-32">
            <p className="text-gray-500 text-sm">
            PLAYER ON AUCTION
            </p>
            <p>
                {name} 
            </p>
            <img src={image} alt="" />
            <div>BY {team}</div>
            <div>Current Price {price} Rupees</div>
        </div>
        </>
    )
}