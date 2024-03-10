import { useState } from "react";
import Letter from "./Letter";
import SubmitButton from "./SubmitButton";

type Props = {
    number: number;
    guess: string;
    loading: boolean;
    submittedClue?: string;
    submitClue?: (clue: string) => any;
};

export default function Guess({ number, guess, loading, submittedClue, submitClue }: Props) {
    const emptyClue = "bbbbb";
    const [clue, setClue] = useState(submittedClue || emptyClue);

    function handleLetterClick(index: number) {
        if (!submittedClue) {
            const newLetterClue = {
                b: "g", // blank -> green
                g: "y", // green -> yellow
                y: "x", // yellow -> X
                x: "g", // X -> green
            }[clue[index]];
            setClue(clue.slice(0, index) + newLetterClue + clue.slice(index + 1));
        }
    }

    async function handleButtonClick() {
        if (submitClue) {
            const success = await submitClue(clue);
            if (success) setClue(emptyClue);
        }
    }

    function isClueValid() {
        return /^[gyx]{5}$/.test(clue);
    }

    return (
        <div className="guess" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                <strong>Guess {number}</strong>
            </div>

            {!submittedClue && (
                <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    Try this word, then click the letters to enter the clue:
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                {guess.split("").map((letter, index) => (
                    <Letter
                        key={index}
                        letter={letter}
                        clue={clue[index]}
                        onClick={() => handleLetterClick(index)}
                    />
                ))}
            </div>

            {!submittedClue && (
                <SubmitButton
                    loading={loading}
                    disabled={loading || !isClueValid()}
                    onClick={handleButtonClick}
                />
            )}
        </div>
    );
}
