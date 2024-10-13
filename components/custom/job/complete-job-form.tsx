import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";

export function CompleteJobForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Check size={18} />
          Complete Job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your seeker</DialogTitle>
          <DialogDescription>This will help other providers assess the seeker's quality of service.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
