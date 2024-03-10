import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { WordleRequestItem, fetchWordleResult } from "../api/api";
import Guess from "./Guess";

export default function Game() {
    const [guesses, setGuesses] = useState<WordleRequestItem[]>([]);
    const [newGuess, setNewGuess] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"ongoing" | "win" | "lose" | "error">("ongoing");

    async function getNextGuess(request: WordleRequestItem[]) {
        let success;

        try {
            const { guess } = await fetchWordleResult(request);
            setNewGuess(guess);
            success = true;
        } catch (err: any) {
            setError(String(err));
            success = false;
        }

        setLoading(false);
        return success;
    }

    useEffect(() => {
        getNextGuess([]);
    }, []);

    async function submitClue(clue: string) {
        const allGuesses = [...guesses, { word: newGuess, clue }];

        if (clue === "ggggg") {
            setStatus("win");
        } else if (allGuesses.length === 6) {
            setStatus("lose");
        } else {
            setError(null);
            setLoading(true);
            setStatus("ongoing");

            const succeeded = await getNextGuess(allGuesses);

            if (!succeeded) {
                setStatus("error");
                return false;
            }
        }

        setGuesses(allGuesses);
        return true;
    }

    if (loading && !newGuess)
        return (
            <div>
                <CircularProgress />
            </div>
        );
    if (!loading && newGuess === "") return <div>Error: something went wrong</div>;

    return (
        <div>
            {guesses.map((request, index) => (
                <Guess
                    key={index}
                    number={index + 1}
                    guess={request.word}
                    submittedClue={request.clue}
                    loading={false}
                ></Guess>
            ))}
            {["ongoing", "error"].includes(status) && (
                <Guess
                    number={guesses.length + 1}
                    guess={newGuess}
                    loading={loading}
                    submitClue={submitClue}
                ></Guess>
            )}
            {["win", "lose"].includes(status) && (
                <div style={{ fontSize: "2rem", marginTop: "2rem" }}>
                    <strong>You {status}!</strong>
                </div>
            )}
            {error && (
                <div style={{ marginTop: "2rem", fontSize: "2rem", color: "red" }}>{error}</div>
            )}
        </div>
    );
}
