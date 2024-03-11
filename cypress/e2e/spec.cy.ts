describe("Wordle Bot game", () => {
    function visitPage() {
        cy.visit(Cypress.env("url") || "http://localhost:3000");
    }

    function reForLetter(letter: string) {
        return new RegExp(`^${letter}$`);
    }

    function showsGuess(number: number, guess: string) {
        guess.split("").forEach((letter) => {
            cy.contains(".guess-letter", reForLetter(letter)).should("exist");
        });
    }

    function clickLetter(guess: number, position: number, times = 1) {
        const element = cy.get(`.guess:nth-child(${guess}) .guess-letter:nth-child(${position})`);

        while (times > 0) {
            element.click();
            times--;
        }
    }

    function submitClue(guess: number, clue: string) {
        clue.split("")
            .map((code, index): [number, number] => {
                const count = {
                    g: 1,
                    y: 2,
                    x: 3,
                }[code];
                return [index + 1, count as number];
            })
            .forEach(([position, times]) => {
                clickLetter(guess, position, times);
            });
        cy.contains("button:not([disabled])", "Submit").click();
    }

    function submitClues(guesses: [string, string][]) {
        guesses.forEach(([word, clue], index) => {
            cy.contains(`Guess ${index + 1}`).should("exist");
            showsGuess(index + 1, word);
            submitClue(index + 1, clue);
        });
    }

    it("shows the first guess", () => {
        visitPage();
        cy.contains("Wordle Bot").should("exist");
        cy.contains("Guess 1").should("exist");
        cy.contains("button[disabled]", "Submit").should("exist");
        showsGuess(1, "SERAI");
    });

    it("wins a game", () => {
        const guesses = [
            ["SERAI", "yxyyx"],
            ["BRAST", "xgggx"],
            ["CRASS", "xgggx"],
            ["GRASP", "ggggg"],
        ] as [string, string][];

        visitPage();
        submitClues(guesses);
        cy.contains("You win!");
        cy.contains("Submit").should("not.exist");
    });

    it("submits an impossible clue", () => {
        const guesses = [
            ["SERAI", "yxyyx"],
            ["BRAST", "xgggx"],
            ["CRASS", "xgggy"],
        ] as [string, string][];

        visitPage();
        submitClues(guesses);
        cy.contains("Error").should("exist");
        cy.contains("button:not([disabled])", "Submit").should("exist");
        [1, 2, 3].forEach((number) => cy.contains(`Guess ${number}`));
        clickLetter(3, 5, 1);
        cy.contains("button:not([disabled])", "Submit").click();
        cy.contains("Error").should("not.exist");
        cy.contains("Guess 4").should("exist");
    });

    it("loses a game", () => {
        // the corrent word is GAWKY
        const guesses = [
            ["SERAI", "xxxyx"],
            ["NYALA", "xyyxx"],
            ["CADGY", "xgxyg"],
            ["GAUMY", "ggxxg"],
            ["GABBY", "ggxxg"],
            ["GAPPY", "ggxxg"],
        ] as [string, string][];

        visitPage();
        submitClues(guesses);
        cy.contains("You lose!");
        cy.contains("Submit").should("not.exist");
    });
});
