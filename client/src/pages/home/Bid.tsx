import image from '../../assets/faf.png'

interface BidProps {
    name: string,
    rating: string
    image: string
}

export default function Bid({ name, rating, playerimage }: BidProps) {
    
    return (
        <span className="bg-white h-32 w-18 mt-4 pl-2 text-black flex items-center space-x-8">
            <img src={image} alt="" className='h-24 rounded-full' />
            <div className='space-y-4'> 
                <div>
                PLAYER NAME 
                </div>
                <div>
                    RATING
                </div>
            </div>
            <div>
                CURRENT PRICE
            </div>
            <button className='bg-green-500 h-8 w-20 rounded-lg font-semibold'>BID</button>
            <button className='bg-red-500 h-8 w-20 rounded-lg font-semibold'>NOT BID</button>
        </span>
    )
}