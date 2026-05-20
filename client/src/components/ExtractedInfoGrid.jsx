const normalizeValue = (value) => {
    if (value === null || value === undefined) return "Not identified";
    if (typeof value === "string") {
        const v = value.trim();
        return v.length ? v : "Not identified";
    }
    return value;
};

const ExtractedInfoGrid = ({ extractedInfo = {} }) => {
    const items = [
        ["Company", normalizeValue(extractedInfo.company)],
        ["Role", normalizeValue(extractedInfo.role)],
        ["Salary", normalizeValue(extractedInfo.salary)],
        ["Contact", normalizeValue(extractedInfo.contact)],
        ["Email", normalizeValue(extractedInfo.email)],
        ["Location", normalizeValue(extractedInfo.location)],
        ["Joining", normalizeValue(extractedInfo.joining)],
        ["Skills", normalizeValue(extractedInfo.skills)],
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(([label, value], index) => (
                <div key={index} className="glass-card rounded-2xl p-5">
                    <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
                        {label}
                    </p>

                    <h3 className="truncate text-lg font-semibold text-white">
                        {value}
                    </h3>
                </div>
            ))}
        </div>
    );
};

export default ExtractedInfoGrid;

