import { motion } from "framer-motion";
import ReactCardFlip from "react-card-flip";

export default function Card({
  content,
  isCorrect,
  isFlipped,
  onClick,
  index,
}: {
  content: string;
  isCorrect: boolean;
  isFlipped: boolean;
  onClick: () => void;
  index: number;
}): JSX.Element {
  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <motion.div
        key="front"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.2, delay: 0.1 * index } }}
        exit={{ scale: 0 }}
        className="flex justify-center items-center w-full h-full border-2 rounded-lg cursor-pointer text-2xl"
        onClick={onClick}
      >
        ?
      </motion.div>
      <div
        className={`flex justify-center items-center w-full h-full border-2 rounded-lg transition-colors duration-500 ${
          isCorrect ? "border-green-200" : "border-primary"
        } text-xl`}
      >
        {content}
      </div>
    </ReactCardFlip>
  );
}
