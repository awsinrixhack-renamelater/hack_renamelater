package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrock"
)

func Gen(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		http.Error(w, "failed to load aws config", http.StatusInternalServerError)
		return
	}

	client := bedrock.NewFromConfig(cfg)

	result, err := client.ListFoundationModels(ctx, &bedrock.ListFoundationModelsInput{})
	if err != nil {
		logMsg := fmt.Sprintf("Couldn't list foundation models: %v", err)
		http.Error(w, logMsg, http.StatusInternalServerError)
		return
	}
	if result == nil || len(result.ModelSummaries) == 0 {
		http.Error(w, "no foundation models found", http.StatusNotFound)
		return
	}
	for _, modelSummary := range result.ModelSummaries {
		if modelSummary.ModelId == nil {
			continue
		}
		fmt.Fprintf(w, "%s\n", *modelSummary.ModelId)
	}
}
