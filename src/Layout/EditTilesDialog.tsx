import { Button } from "@/components/ui/button";
import { DialogClose, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { card } from "@/lib/interfaces";

export default function EditTilesDialog({
  setCards,
}: {
  setCards: React.Dispatch<React.SetStateAction<card[]>>;
}): JSX.Element {
  const [count, setCount] = useState<number>(8);
  const [isUserEditingTiles, setIsUserEditingTiles] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(false);

  function generateSchema(): z.ZodObject<{ [key: string]: z.ZodString }> {
    const schema: { [key: string]: z.ZodString } = {};
    for (let i = 1; i <= count; i++) {
      schema[`input${i}`] = z.string();
    }
    return z.object(schema);
  }

  const formSchema = generateSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (Object.values(values).every((content) => content.length > 0)) {
      let cards: card[] = [];
      for (let i = 0; i < count * 2; i++) {
        cards.push({
          id: i,
          content: Object.values(values)[i % count],
          isCorrect: false,
          isFlipped: false,
        });
      }
      setCards(cards);
      setCanClose(true);
      alert("Tiles have been updated. You can close the dialog now.");
    } else {
      alert("All inputs must be filled");
    }
  }

  function changeEditTilesState(): void {
    if (count % 2 !== 0 || count < 8 || count > 32) {
      alert("Count must be an even number between 8 and 32");
      return;
    }
    setIsUserEditingTiles((isUserEditingTiles) => !isUserEditingTiles);
  }

  function generateInputs(): JSX.Element[] {
    const inputs = [];
    for (let i = 1; i <= count; i++) {
      const inputName: string = `input${i}`;
      inputs.push(
        <FormField
          key={i}
          control={form.control}
          name={inputName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Card content" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }
    return inputs;
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
            <p>Change the number of tiles and their content.</p>
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {!isUserEditingTiles ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="a"
              className="grid gap-4 py-4"
            >
              <Label htmlFor="count">Count (8-32, all the even numbers)</Label>
              <Input
                type="number"
                placeholder="Count"
                id="count"
                min={8}
                max={32}
                defaultValue={count}
                onChange={(e) => {
                  setCount(+e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  changeEditTilesState();
                }}
                variant="outline"
              >
                Go to tiles
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="b"
              className="flex flex-col gap-4 py-4"
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className=" flex flex-col gap-4 max-h-80 overflow-y-auto p-4">
                    {generateInputs()}
                  </div>
                  <Button type="submit">Submit</Button>
                </form>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsUserEditingTiles(
                      (isUserEditingTiles) => !isUserEditingTiles
                    );
                  }}
                >
                  Go back
                </Button>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
        {canClose && (
          <DialogClose>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
}
