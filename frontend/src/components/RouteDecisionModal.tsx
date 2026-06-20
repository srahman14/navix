import React from "react";
import { useNavigationStore } from "@/store/navigation-store";
import * as Dialog from "@radix-ui/react-dialog";
import { X, TrendingUp } from "lucide-react";
import { formatDistance, formatDuration } from "@/lib/format";

interface RouteDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RouteDecisionModal: React.FC<RouteDecisionModalProps> = ({
  open,
  onOpenChange,
}) => {
  // Report
  const report = useNavigationStore((state) => state.routeDecisionReport);
  const loading = useNavigationStore((state) => state.isGeneratingReport);
  const error = useNavigationStore((state) => state.reportError);

  // Report Explanation
  const explanation = useNavigationStore((state) => state.routeExplanation);
  const loadingExplanation = useNavigationStore(
    (state) => state.isGeneratingExplanation,
  );
  const explanationError = useNavigationStore(
    (state) => state.explanationError,
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

        {/* Modal */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 rounded-lg">
          {/* Header */}
          <header className="flex flex-col">
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
            <div>
              <Dialog.Description className="text-xs font-bold">
                This is a generated report for{" "}
                <span className="text-green-500">{report?.vehicleId}</span> for
                route {report?.bestRouteIndex! + 1}.
              </Dialog.Description>
            </div>
          </header>

          {/* BODY */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="h-8 w-8 border-2 border-zinc-300 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Generating report...</p>
            </div>
          )}

          {error && <div className="text-red-500 text-sm py-4">{error}</div>}

          {!loading && !error && report && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500">Details</p>
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <ul className="text-xs font-bold tracking-tight grid grid-cols-2">
                    <li>Vehicle ID: {report.vehicleId}</li>
                    <li>Vehicle Type: {report.vehicleType}</li>
                    <li>
                      Total Distance: {formatDistance(report.totalDistance)}
                    </li>
                    <li>
                      Total Duration: {formatDuration(report.totalDuration)}
                    </li>
                    <li>No. Orders Assigned: {report.ordersAssigned}</li>
                    <li>Capacity Used: {report.capacityUsedPercent}%</li>
                  </ul>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Recommendation</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {report.recommendation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <p className="text-xs text-zinc-500">Best Route</p>
                  <p className="text-xl font-bold text-green-500">
                    #{report.bestRouteIndex + 1}
                  </p>
                </div>

                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <p className="text-xs text-zinc-500">Score</p>
                  <p className="text-xl font-bold text-green-500">
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
          {explanation && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-zinc-500">Explanation</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {explanation.explanation}
                </p>
              </div>

              <div className="space-y-2">
                {explanation.routeBreakdown.map((route) => (
                  <div
                    key={route.index}
                    className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 ease-in-out duration-200 transition-all "
                  >
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">Route {route.index + 1}</p>

                      {route.index === explanation.bestRouteIndex && (
                        <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">
                          BEST
                        </span>
                      )}
                    </div>

                    <p className="text-sm mb-2">{route.reason}</p>

                    <div className="text-xs text-zinc-500 space-y-1">
                      <p>Score: {route.score.toFixed(3)}</p>
                      <p>
                        Distance Impact:{" "}
                        {route.keyFactors.distanceScore.toFixed(3)}
                      </p>
                      <p>
                        Duration Impact:{" "}
                        {route.keyFactors.durationScore.toFixed(3)}
                      </p>
                      <p>
                        Capacity Penalty:{" "}
                        {route.keyFactors.capacityPenalty.toFixed(3)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RouteDecisionModal;
