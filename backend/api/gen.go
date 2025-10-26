package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"regexp"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
)

func RemoveReasoningBlock(s string) string {
	re := regexp.MustCompile(`(?s)<reasoning>.*?</reasoning>`)
	return re.ReplaceAllString(s, "")
}

// generates a problem
func Gen(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("us-east-1"))
	if err != nil {
		http.Error(w, "failed to load aws config: "+err.Error(), http.StatusInternalServerError)
		return
	}

	client := bedrockruntime.NewFromConfig(cfg)
	modelID := "openai.gpt-oss-120b-1:0"

	var req struct {
		Input string `json:"input"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request: "+err.Error(), http.StatusBadRequest)
		return
	}
	if req.Input == "" {
		http.Error(w, "Missing input field", http.StatusBadRequest)
		return
	}

	prompt := fmt.Sprintf(`
Output a JSON only - no reasoning, no explanations, no commentary.
You are an expert educator creating high-quality assessment questions on: %s

Follow these rules strictly:
- Generate ONE question only.
- Output ONLY valid JSON.
- The JSON must have exactly one key: "question_latex"
- The value must be the LaTeX-formatted question as a single string.
- Do NOT include any commentary, explanations, or extra text.

QUALITY REQUIREMENTS:
1. Cognitive Depth: higher-order thinking (application, analysis, synthesis)
2. Specificity: clear, unambiguous focus
3. Practical Relevance: connected to real-world applications
4. Progressive Difficulty: include conceptual and advanced reasoning

Avoid fluff (definitions, lists, yes/no questions).

Example output format:
{
	"question_latex": "\\text{A call center receives an average of 3 calls per minute. Using the Poisson distribution, calculate the probability of receiving exactly 5 calls in a 2-minute window. Show your derivation of the rate parameter.}"
}
`, req.Input)

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
			QuestionLatex string `json:"question_latex"`
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
	w.WriteHeader(http.StatusOK)
	w.Write(resp.Body)
}
