import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import { card } from "@/lib/interfaces";

export default function EditTilesDialog({
  setCards,
}: {
  setCards: React.Dispatch<React.SetStateAction<card[]>>;
}): JSX.Element {
  const { control, register, getValues } = useForm({
    defaultValues: {
      cardText: [{ text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cardText",
  });

  function onSubmit() {
    const inputValues = getValues().cardText;
    const filteredValues = inputValues.filter((content) => content.text.trim());

    if (new Set(filteredValues.map((content) => content.text)).size !== filteredValues.length) {
      alert("All inputs must be unique");
      return;
    }

    if (filteredValues.every((content) => content.text.length > 0)) {
      const cards: card[] = [];
      for (let i = 0; i < filteredValues.length * 2; i++) {
        cards.push({
          id: i,
          content: filteredValues[i % filteredValues.length].text,
          isCorrect: false,
          isFlipped: false,
        });
      }
      setCards(cards);
      alert("Tiles have been updated. You can close the dialog now.");
    } else {
      alert("All inputs must be filled");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Tiles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tiles</DialogTitle>
          <DialogDescription>
            Change the number of tiles and their content. (4-16 inputs)
          </DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="b"
          className="flex flex-col gap-4 py-4"
        >
          <form
            onSubmit={control.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className=" flex flex-col gap-4 max-h-80 overflow-y-auto pr-4 p-1">
              {fields.map((field, i) => {
                return (
                  <span
                    key={field.id}
                    className="flex items-center w-full gap-2"
                  >
                    <Input
                      {...register(`cardText.${i}.text`, {
                        required: true,
                      })}
                      defaultValue=""
                    />
                    {fields.length > 4 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(i)}
                        title="Delete field"
                      >
                        -
                      </Button>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="flex items-center w-full gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => {
                  append({ text: "" });
                }}
                disabled={fields.length >= 16}
              >
                Add
              </Button>
              <Button
                type="submit"
                disabled={fields.length < 4}
                className="w-full"
              >
                Submit
              </Button>
            </span>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
