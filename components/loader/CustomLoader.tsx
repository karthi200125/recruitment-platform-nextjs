import "./CustomLoader.css";

const Loader = () => {
    return (
        <span
            className="loader"
            role="status"
            aria-label="Loading"
        >
            {Array.from({ length: 12 }).map((_, index) => (
                <span
                    key={index}
                    className="loader-dot"
                    style={{
                        "--i": index,
                    } as React.CSSProperties}
                />
            ))}
        </span>
    );
};

export default Loader;