package com.lsvt.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LiveResolutionResponse", description = "Resolution details with live vote counts.")
public class LiveResolutionResponse {

    private ResolutionResponse resolution;
    private ResolutionResultsResponse liveResults;

    public LiveResolutionResponse(ResolutionResponse resolution, ResolutionResultsResponse liveResults) {
        this.resolution = resolution;
        this.liveResults = liveResults;
    }

    public ResolutionResponse getResolution() {
        return resolution;
    }

    public ResolutionResultsResponse getLiveResults() {
        return liveResults;
    }
}
