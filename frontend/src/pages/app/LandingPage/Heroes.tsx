

export const Heroes = () => {
    return (
        <div className="
        flex flex-col
        md:flex-row
        flex-wrap
        items-center justify-center
        max-w-5xl
        gap-6
        ">
            <div className=" flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[350px]
                sm:h-[350px] md:h-[400px] md:w-[400px]">
                    <img alt="documents" className="object-contain hidden dark:block" src="/documents-dark.png"/> 
                    <img alt="documents" className="object-contain dark:hidden" src="/documents.png"/>  
                </div>
            </div>

            <div className="relative h-[300px] w-[300px] 
            sm:w-[350px] sm:h-[350px]
            md:w-[400px] md:h-[400px]">

                <img alt="reading" className="object-contain dark:hidden" src="/reading.png"/>
                <img alt="reading" className="object-contain hidden dark:block" src="/reading-dark.png"/>
                 
            </div>


        </div>

    )
};




export default Heroes;

