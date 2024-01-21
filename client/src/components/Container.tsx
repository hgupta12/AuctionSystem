import { PropsWithChildren } from "react"

export default function Container ({ children } : PropsWithChildren) {

    return (
        <div className="bg-white w-full h-full rounded-sm">
            { children }
        </div>
    )
}