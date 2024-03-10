type Props = {
    letter: string;
    clue: string;
    onClick: (...args: any) => any;
};

export default function Letter({ letter, clue, onClick }: Props) {
    const color = clue === "b" ? "black" : "white";
    const backgroundColor = {
        b: "white",
        g: "rgb(83, 141, 78)",
        y: "rgb(181, 159, 59)",
        x: "rgb(58, 58, 60)",
    }[clue];

    return (
        <div
            style={{
                backgroundColor,
                color,
                width: "1.8rem",
                boxSizing: "content-box",
                padding: "1rem",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                border: "1px solid gray",
                fontSize: "2.2rem",
                cursor: "pointer",
                userSelect: "none",
            }}
            onClick={onClick}
        >
            <strong>{letter.toUpperCase()}</strong>
        </div>
    );
}
