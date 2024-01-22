interface Args {
    image: string;
    funds: string;
    players: number;
    totalPlayers?: number;
}

export default function TeamCard ({ image, funds, players, totalPlayers = 25 } : Args) {
    return (
        <div className="border-2 shadow rounded p-4 text-center">
            <img src={image} alt="" className="w-20 mb-3 block mx-auto" />
            <h1 className="font-semibold text-xs">FUNDS REMAINING</h1>
            <p className="text-lg mb-3">{ funds }</p>
            <h1 className="font-semibold text-xs">TOTAL PLAYERS</h1>
            <p className="text-lg">{ players }/{ totalPlayers }</p>
        </div>
    )
}