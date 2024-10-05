import { useSearchParams } from "next/navigation";

export default function usePaginationSearchParams() {
  const searchParams = useSearchParams()
  const page = +(searchParams.get("page") ?? 1)
  const size = +(searchParams.get("size") ?? 10)
  const start = (page - 1) * size
  const end = start + size

  return { start, end }
}

