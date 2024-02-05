import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface card {
  id: number;
  content: string;
  isCorrect: boolean;
  isFlipped: boolean;
}

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
  const [canFlip, setCanFlip] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  function flipCard(id: number) {
    if (!canFlip) return;
    setCards((cards) =>
      cards.map((card) =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
    setCanFlip(false);
  }

  function checkIfCorrect() {
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

  function startGame() {
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

  function isGameFinished() {
    return cards.every((card) => card.isCorrect);
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-8">
      {hasStarted && (
        <>
          <div className="grid grid-cols-4 grid-rows-4 w-[600px] h-[600px] gap-2">
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
      {!hasStarted && <Button onClick={startGame}>Start</Button>}
    </div>
  );
}
