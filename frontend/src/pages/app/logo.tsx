import LotionIcon from './frontend/public/LotionIcon.png'



import { cn } from '../../lib/utils'

export const Logo = () => {
    return (
        <div className='hidden md:flex items-center gap-x-2'>
            <img height={40} width={40} alt='Logo' src='/LotionIcon.png'></img>
            <p className={cn("font-poppins font-semibold")}>Lotion</p>
        </div>
        

    )
}