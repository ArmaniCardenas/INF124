import { Heading } from "./page";
import Heroes from "./Heroes";
import { Footer } from "./footer";


export const LandingPage = () =>
{
    return(
        <>
        <div className='min-h-screen flex flex-col dark:bg-[#1F1F1F]'>
            <div className='flex flex-col items-center justify-center md:justify-center
            text-center gap-y-8 
            flex-1 px-6 pb-10'>
                <Heading/>

                <Heroes/>
            </div>
            <Footer/>
      </div>
      </>
    )
};