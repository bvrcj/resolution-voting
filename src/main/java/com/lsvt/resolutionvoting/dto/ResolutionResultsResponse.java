package com.lsvt.resolutionvoting.dto;

import com.lsvt.resolutionvoting.model.ResolutionStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ResolutionResultsResponse", description = "Aggregated voting results for a resolution.")
public class ResolutionResultsResponse {

    @Schema(example = "10")
    private Long resolutionId;
    @Schema(example = "Adopt new voting policy")
    private String resolutionTitle;
    @Schema(example = "Adopt the updated voting policy for the board.")
    private String resolutionDescription;
    @Schema(description = "Room where the resolution is being voted.")
    private RoomResponse room;
    @Schema(example = "CLOSED", description = "Status: DRAFT, PUBLISHED, VOTING, PROXY_VOTING, CLOSED, RESULTS_PUBLISHED.")
    private ResolutionStatus status;
    @Schema(example = "3")
    private long totalVotes;
    @Schema(example = "2")
    private long forCount;
    @Schema(example = "1")
    private long againstCount;
    @Schema(example = "0")
    private long abstainCount;
    @Schema(description = "Breakdown of direct votes.")
    private VoteBreakdown directVotes;
    @Schema(description = "Breakdown of proxy votes.")
    private VoteBreakdown proxyVotes;

    public ResolutionResultsResponse(
            Long resolutionId,
            String resolutionTitle,
            String resolutionDescription,
            RoomResponse room,
            ResolutionStatus status,
            long totalVotes,
            long forCount,
            long againstCount,
            long abstainCount,
            VoteBreakdown directVotes,
            VoteBreakdown proxyVotes
    ) {
        this.resolutionId = resolutionId;
        this.resolutionTitle = resolutionTitle;
        this.resolutionDescription = resolutionDescription;
        this.room = room;
        this.status = status;
        this.totalVotes = totalVotes;
        this.forCount = forCount;
        this.againstCount = againstCount;
        this.abstainCount = abstainCount;
        this.directVotes = directVotes;
        this.proxyVotes = proxyVotes;
    }

    public Long getResolutionId() {
        return resolutionId;
    }

    public String getResolutionTitle() {
        return resolutionTitle;
    }

    public String getResolutionDescription() {
        return resolutionDescription;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public ResolutionStatus getStatus() {
        return status;
    }

    public long getTotalVotes() {
        return totalVotes;
    }

    public long getForCount() {
        return forCount;
    }

    public long getAgainstCount() {
        return againstCount;
    }

    public long getAbstainCount() {
        return abstainCount;
    }

    public VoteBreakdown getDirectVotes() {
        return directVotes;
    }

    public VoteBreakdown getProxyVotes() {
        return proxyVotes;
    }

    @Schema(name = "VoteBreakdown", description = "Vote counts by choice.")
    public static class VoteBreakdown {
        @Schema(example = "2")
        private long total;
        @Schema(example = "2")
        private long forCount;
        @Schema(example = "0")
        private long againstCount;
        @Schema(example = "0")
        private long abstainCount;

        public VoteBreakdown(long total, long forCount, long againstCount, long abstainCount) {
            this.total = total;
            this.forCount = forCount;
            this.againstCount = againstCount;
            this.abstainCount = abstainCount;
        }

        public long getTotal() {
            return total;
        }

        public long getForCount() {
            return forCount;
        }

        public long getAgainstCount() {
            return againstCount;
        }

        public long getAbstainCount() {
            return abstainCount;
        }
    }
}

