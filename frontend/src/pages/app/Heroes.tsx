

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center
         max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[350px]
                sm:h-[350px] md:h-[400px] md:w-[400px]">
                    <img alt="documents" className="object-cover absolute top-0 left-0 right-0 bottom-0" src="/documents.png"/>  
                </div>
            </div>

            <div className="relative h-[400px] w-[400px]">
                <img alt="reading" className="object-contain" src="/reading.png"/>
                 
            </div>


        </div>

    )
};




export default Heroes;

