"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteQrCode } from "@/lib/actions/qr";

export function DeleteQrButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteQrCode(id);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("QR-Code gelöscht.");
      setOpen(false);
      router.push("/app/qr");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="text-destructive">
            <Trash2 className="size-4" />
            Löschen
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR-Code löschen?</DialogTitle>
          <DialogDescription>
            „{name}" wird dauerhaft entfernt. Bei getrackten Codes gehen auch
            alle Scan-Daten verloren. Das kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Abbrechen</Button>} />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Endgültig löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
