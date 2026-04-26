import { Skeleton } from "@/components/ui/skeleton";

export const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full rounded-2xl" />
    ))}
  </div>
);

export const CardSkeleton = () => <Skeleton className="h-40 w-full rounded-3xl" />;
