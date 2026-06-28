import Image from "next/image";
import Link from "next/link";




export default function Hero() {
    const stats = [
        {
            number: "50k+",
            title: "Happy Patient"
        },
        {
            number: "350+",
            title: "Spacialist Doctor"
        },
        {
            number: "98%",
            title: "Our Success"
        }
    ]
    return (
        <section className="bg-white">
            <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col item-center  px-6 lg:flex-row lg:px-12">

                {/* Left Content */}

                <div className="w-full lg:w-1/2">

                    <h1 className="mt-6 text-5xl font-bold leading-tight ">
                        Instant booking, Trusted
                        <br />
                        doctors, Better care
                    </h1>
                    <p className="text-gray-500 mt-6 mx-w-lg text-lg leading-8">
                        You can monitor and manage your business with the platform
                        <br />
                        we will provide. You can monitor and manage your
                    </p>
                    <div className="mt-10 ml-40">
                        <Link
                            href="/appointment"
                            className=" border rounded-lg bg-blue-600 text-white px-8 py-4 font-semibold transition duration-500 hover:text-blue-600 hover:bg-white"
                        >
                            Book Appointment
                        </Link>
                    </div>

                    <div className="mt-14 flex gap-20">
                        {stats.map((stat) => (
                            <div key={stat.title}>
                                <h3 className="text-blue-600 font-bold text-5xl">
                                    {stat.number}
                                </h3>
                                <p className="text-blue-400 font-semibold text-xl">
                                    {stat.title}
                                </p>
                            </div>
                        )
                        )}
                    </div>
                </div>
                {/* Right Image */}
                <div className="relative mt-6 flex w-full justify-center lg:mt-0 lg:w-1/2">

                    {/* Blue Glow */}
                    <div className="absolute top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-blue-500 blur-3xl" />

                    <Image
                        src="/doctor.png"
                        alt="Doctor"
                        width={550}
                        height={650}
                        priority
                        className="-mt-10 h-auto w-full max-w-[500px] object-contain drop-shadow-xl"
                    />
                </div>

            </div>
        </section>
    )
}