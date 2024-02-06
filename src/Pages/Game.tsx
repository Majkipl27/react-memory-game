import EditTilesDialog from "@/Layout/EditTilesDialog";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { card } from "@/lib/interfaces";
import { useEffect, useState } from "react";

export default function Game(): JSX.Element {
  const [tries, setTries] = useState<number>(0);
  const [cards, setCards] = useState<card[]>([
    { id: 1, content: "🍕", isCorrect: false, isFlipped: false },
    { id: 2, content: "🍔", isCorrect: false, isFlipped: false },
    { id: 3, content: "🍟", isCorrect: false, isFlipped: false },
    { id: 4, content: "🍿", isCorrect: false, isFlipped: false },
    { id: 5, content: "🥤", isCorrect: false, isFlipped: false },
    { id: 6, content: "🍦", isCorrect: false, isFlipped: false },
    { id: 7, content: "🍩", isCorrect: false, isFlipped: false },
    { id: 8, content: "🍪", isCorrect: false, isFlipped: false },
    { id: 9, content: "🍕", isCorrect: false, isFlipped: false },
    { id: 10, content: "🍔", isCorrect: false, isFlipped: false },
    { id: 11, content: "🍟", isCorrect: false, isFlipped: false },
    { id: 12, content: "🍿", isCorrect: false, isFlipped: false },
    { id: 13, content: "🥤", isCorrect: false, isFlipped: false },
    { id: 14, content: "🍦", isCorrect: false, isFlipped: false },
    { id: 15, content: "🍩", isCorrect: false, isFlipped: false },
    { id: 16, content: "🍪", isCorrect: false, isFlipped: false },
  ]);

  const [canFlip, setCanFlip] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  function flipCard(id: number): void {
    if (!canFlip) return;
    setCards((cards) =>
      cards.map((card) =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
    setCanFlip(false);
  }

  function checkIfCorrect(): void {
    const flippedCards = cards.filter(
      (card) => card.isFlipped && !card.isCorrect
    );
    setCanFlip(false);
    if (flippedCards.length === 2) {
      setTries((tries) => tries + 1);
      if (flippedCards[0].content === flippedCards[1].content) {
        setTimeout(() => {
          setCards((cards) =>
            cards.map((card) =>
              card.isFlipped ? { ...card, isCorrect: true } : card
            )
          );
        }, 1000);
        setTimeout(() => {
          setCanFlip(true);
        }, 1300);
      } else {
        setTimeout(() => {
          setCards((cards) =>
            cards.map((card) =>
              flippedCards.includes(card) ? { ...card, isFlipped: false } : card
            )
          );
        }, 1000);
        setTimeout(() => {
          setCanFlip(true);
        }, 1300);
      }
    } else {
      setTimeout(() => {
        setCanFlip(true);
      }, 300);
    }
    if (isGameFinished()) {
      alert(
        `Gratulacje! Wygrałeś! Potrzebowałeś ${tries} prób. Kliknij ok aby zagrać ponownie.`
      );
      setHasStarted(false);
      setTries(0);
      setCards((cards) =>
        cards
          .sort(() => Math.random() - 0.5)
          .map((card) => ({ ...card, isCorrect: false, isFlipped: false }))
      );
      setCanFlip(false);
    }
  }

  useEffect(checkIfCorrect, [cards]);

  function startGame(): void {
    setTries(0);
    setHasStarted(true);
    setTimeout(() => {
      setCards((cards) =>
        cards
          .sort(() => Math.random() - 0.5)
          .map((card) => ({ ...card, isFlipped: true }))
      );
    }, 2000);
    setCanFlip(false);
    setTimeout(() => {
      setCards((cards) => cards.map((card) => ({ ...card, isFlipped: false })));
      setCanFlip(true);
    }, 5000);
  }

  function isGameFinished(): boolean {
    return cards.every((card) => card.isCorrect);
  }

  function exportJson(): void {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(cards)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "cards.json";
    a.click();
  }

  function loadJson(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/json") {
      alert("Invalid file type. Please upload a .json file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      setCards(JSON.parse(content as string));
    };
    reader.readAsText(file);
    alert("Tiles have been uploaded successfully.");
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-8">
      {hasStarted && (
        <>
          <div className={`grid w-[600px] min-h-[600px] grid-cols-4 gap-2`}>
            {cards.map((card, i) => (
              <Card
                key={card.id}
                index={i}
                content={card.content}
                isCorrect={card.isCorrect}
                isFlipped={card.isFlipped}
                onClick={() => flipCard(card.id)}
              />
            ))}
          </div>
          <p className="text-foreground">Liczba prób: {tries}</p>
        </>
      )}
      {!hasStarted && (
        <>
          <Button onClick={startGame}>Start</Button>
          <p>You can import / export your set below.</p>
          <div className="flex items-center gap-4">
            <EditTilesDialog setCards={setCards} />
            <Input
              type="file"
              name="import"
              accept=".json"
              onChange={loadJson}
              placeholder="Import Json"
            />
            <Button variant="outline" onClick={exportJson}>
              Export json
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
