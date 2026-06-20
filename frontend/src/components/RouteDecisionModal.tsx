import React from "react";
import { useNavigationStore } from "@/store/navigation-store";
import * as Dialog from "@radix-ui/react-dialog";
import { X, TrendingUp } from "lucide-react";

interface RouteDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RouteDecisionModal: React.FC<RouteDecisionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const report = useNavigationStore((state) => state.routeDecisionReport);
  const loading = useNavigationStore((state) => state.isGeneratingReport);
  const error = useNavigationStore((state) => state.reportError);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

        {/* Modal */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 shadow-lg">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} />
              Route Decision Report
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* BODY */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="h-8 w-8 border-2 border-zinc-300 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">
                Generating report...
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm py-4">
              {error}
            </div>
          )}

          {!loading && !error && report && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500">Recommendation</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {report.recommendation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <p className="text-xs text-zinc-500">Best Route</p>
                  <p className="text-xl font-bold">
                    #{report.bestRouteIndex + 1}
                  </p>
                </div>

                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <p className="text-xs text-zinc-500">Score</p>
                  <p className="text-xl font-bold">
                    {report.score?.toFixed(3) ?? 0}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {report.summary}
                </p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RouteDecisionModal;