import Image from "next/image";
import Link from "next/link";


export default function Hero() {
    const stats = [
        {
            number: "50k+",
            title: "Happy Patient"
        },
        {
            number: "150+",
            title: "Specialist Doctor"
        },
        {
            number: "98%",
            title: "Our Success"
        }
    ]
    return (
        <section className="bg-white">
            <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col-reverse items-center justify-center gap-12 px-6 py-12 lg:flex-row lg:gap-0 lg:px-12">

                <div className="w-full text-center lg:w-1/2 lg:text-left">

                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl  lg:text-6xl text-black">
                        Instant booking Trusted doctors <br /> Better care
                    </h1>
                    <div className="mt-10 flex justify-center  lg:justify-start">
                        <Link
                            href="/login"
                            className=" border rounded-lg bg-blue-600 text-white px-8 py-4 font-semibold transition duration-500 hover:text-blue-600 hover:bg-white"
                        >
                            Book Appointment
                        </Link>
                    </div>

                    <div className="mt-14 grid grid-cols-3 gap-8 text-center lg:text-left">
                        {stats.map((stat) => (
                            <div key={stat.title}>
                                <h3 className="text-blue-600 font-bold text-3xl sm:text-4xl lg:text-5xl">
                                    {stat.number}
                                </h3>
                                <p className="text-blue-400 font-semibold text-base sm:text-lg lg:text-xl ">
                                    {stat.title}
                                </p>
                            </div>
                        )
                        )}
                    </div>
                </div>
                {/* Right Image */}
                <div className="relative  flex w-full justify-center lg:w-1/2">

                    {/* Blue Glow */}
                    <div className="absolute top-1/2 h-64 w-64 -sm:-  -translate-y-1/2 rounded-full bg-blue-500 opacity-60 blur-3xl sm:h-80 sm:w-80 lg:h-[450px] lg:w-[450px]" />

                    <Image
                        src="/doctor.png"
                        alt="Doctor"
                        width={550}
                        height={650}
                        priority
                        className="-mt-10 h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain drop-shadow-xl"
                    />
                </div>

            </div>
        </section>
    )
}