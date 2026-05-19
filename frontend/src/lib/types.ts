export type Room = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Resolution = {
  id: number;
  title: string;
  description: string;
  status: string;
  room: Room;
  createdAt: string;
  updatedAt: string;
  publishAt: string | null;
  votingStartAt: string | null;
  votingEndAt: string | null;
  votingStartedAt: string | null;
  votingEndedAt: string | null;
  primaryPurposePerson: User | null;
  secondaryPurposePerson: User | null;
};

export type VoteBreakdown = {
  total: number;
  forCount: number;
  againstCount: number;
  abstainCount: number;
};

export type Results = {
  resolutionId: number;
  resolutionTitle: string;
  resolutionDescription: string;
  status: string;
  room: Room;
  totalVotes: number;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  directVotes: VoteBreakdown;
  proxyVotes: VoteBreakdown;
};

export type LiveResolution = {
  resolution: Resolution;
  liveResults: Results | null;
};
