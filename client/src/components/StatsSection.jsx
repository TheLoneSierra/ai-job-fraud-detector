const stats = [
    {
        title: "Fake HR Scams",
        description: "Major impersonation fraud targeting job seekers.",
        color: "text-red-400",
    },
    {
        title: "Interview Payment Frauds",
        description: "Scammers demand fake registration fees.",
        color: "text-orange-300",
    },
    {
        title: "Phishing Job Links",
        description: "Malicious links hidden inside job offers.",
        color: "text-cyan-300",
    },
    {
        title: "Telegram Recruiter Scams",
        description: "Unverified recruiters using messaging apps.",
        color: "text-blue-300",
    },
];

const StatsSection = () => {
    return (
        <section className="border-y border-white/5 bg-[#0b0e15]/60 py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-2xl p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
                    >
                        <h3 className={`mb-4 text-xl font-bold ${item.color}`}>
                            {item.title}
                        </h3>

                        <p className="text-sm leading-6 text-gray-400">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;