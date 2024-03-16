import { useEffect, useState } from 'react';

export default function MyTeam() {
    const [team, setTeam] = useState(null);

    useEffect(() => {
        
    }, []);

    if (!team) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{team.name}</h1>
            {team.players.map(player => (
                <div key={player.id}>
                    <img src={player.image} alt={player.name} />
                    <h2>{player.name}</h2>
                </div>
            ))}
        </div>
    );
}
