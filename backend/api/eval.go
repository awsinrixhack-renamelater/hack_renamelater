package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
)

// generates a problem
func Eval(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("us-east-1"))
	if err != nil {
		http.Error(w, "failed to load aws config: "+err.Error(), http.StatusInternalServerError)
		return
	}

	client := bedrockruntime.NewFromConfig(cfg)
	modelID := "openai.gpt-oss-120b-1:0"

	var req struct {
		Answer   string `json:"answer"`
		Question string `json:"question`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request: "+err.Error(), http.StatusBadRequest)
		return
	}
	if req.Answer == "" {
		http.Error(w, "Missing input field", http.StatusBadRequest)
		return
	}

	prompt := fmt.Sprintf(`
Output a JSON only - no reasoning, no explanations, no commentary.
You are an expert educator assessing answers to assessment questions.
Your student answered %s to the problem: %s

Follow these rules strictly:
- Output ONLY valid JSON.
- The JSON must have exactly one key: "score"
- The value must be out of 100.
- Do NOT include any commentary, explanations, or extra text.


Example output format:
{
	"score":"90.5"
}
`, req.Answer, req.Question)

	bodyBytes, _ := json.Marshal(map[string]interface{}{
		"model": modelID,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"max_completion_tokens": 512,
	})

	input := &bedrockruntime.InvokeModelInput{
		ModelId:     aws.String(modelID),
		ContentType: aws.String("application/json"),
		Body:        bodyBytes,
	}

	resp, err := client.InvokeModel(ctx, input)
	if err != nil {
		http.Error(w, fmt.Sprintf("invoke model failed: %v", err), http.StatusInternalServerError)
		return
	}
	if resp == nil || len(resp.Body) == 0 {
		http.Error(w, "empty response from model", http.StatusInternalServerError)
		return
	}

	var modelResp struct {
		OutputText string `json:"output_text"`
	}
	if err := json.Unmarshal(resp.Body, &modelResp); err == nil && modelResp.OutputText != "" {
		var latexObj struct {
			QuestionLatex string `json:"question_latex"`
		}
		cleaned := RemoveReasoningBlock(modelResp.OutputText)
		if err := json.Unmarshal([]byte(cleaned), &latexObj); err == nil && latexObj.QuestionLatex != "" {
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			w.Write([]byte(latexObj.QuestionLatex))
			return
		}
		var openAIResp struct {
			Choices []struct {
				Message struct {
					Content string `json:"content"`
				} `json:"message"`
			} `json:"choices"`
		}
		if err := json.Unmarshal([]byte(modelResp.OutputText), &openAIResp); err == nil && len(openAIResp.Choices) > 0 {
			content := openAIResp.Choices[0].Message.Content
			contentClean := RemoveReasoningBlock(content)
			start := -1
			end := -1
			for i := 0; i < len(contentClean); i++ {
				if contentClean[i] == '{' && start == -1 {
					start = i
				}
				if contentClean[i] == '}' {
					end = i
				}
			}
			if start != -1 && end != -1 && end > start {
				jsonStr := contentClean[start : end+1]
				if err := json.Unmarshal([]byte(jsonStr), &latexObj); err == nil && latexObj.QuestionLatex != "" {
					w.Header().Set("Content-Type", "text/plain; charset=utf-8")
					w.Write([]byte(latexObj.QuestionLatex))
					return
				}
			}
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			w.Write([]byte(contentClean))
			return
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Write([]byte(modelResp.OutputText))
		return
	}

	var openAIResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(resp.Body, &openAIResp); err == nil && len(openAIResp.Choices) > 0 {
		content := openAIResp.Choices[0].Message.Content
		var latexObj struct {
			QuestionLatex string `json:"score"`
		}
		contentClean := RemoveReasoningBlock(content)
		start := -1
		end := -1
		for i := 0; i < len(contentClean); i++ {
			if contentClean[i] == '{' && start == -1 {
				start = i
			}
			if contentClean[i] == '}' {
				end = i
			}
		}
		if start != -1 && end != -1 && end > start {
			jsonStr := contentClean[start : end+1]
			if err := json.Unmarshal([]byte(jsonStr), &latexObj); err == nil && latexObj.QuestionLatex != "" {
				w.Header().Set("Content-Type", "text/plain; charset=utf-8")
				w.Write([]byte(latexObj.QuestionLatex))
				return
			}
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Write([]byte(contentClean))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(resp.Body)
}
