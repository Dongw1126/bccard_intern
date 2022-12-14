import { useCallback, useState } from "react";

/**
 *  Dialog용 Custom hook
 */
function useDialog() {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return [open, handleDialogOpen, handleDialogClose];
}

export default useDialog;
