import { candidateStatuses, type CandidateStatus } from "@/lib/admin-fields";

export default function CandidateStatusChip({ status }: { status: CandidateStatus }) {
  return <span className="admin-status" data-status={status}>{candidateStatuses[status]}</span>;
}
