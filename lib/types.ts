export type CandidatePayload = {
  fullName: string;
  email: string;
  location: string;
  linkedinUrl: string | null;
  whatsapp: string;
  role?: string;
  communityExperience?: string;
  communityType?: string;
  communityAge?: string;
  participantCount?: string;
  workMode?: string;
  previousExperience?: string;
  mainChallenge?: string;
  motivation?: string;
  contribution?: string;
  expectations?: string;
  topics?: string;
  imageConsent?: boolean;
};

export type CandidateRecord = CandidatePayload & {
  id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
};
