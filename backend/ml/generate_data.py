import random
import pandas as pd
import os

def generate_synthetic_data(n_users=1000, n_questions_per_user=50, output_dir="data"):
    topics = ["Algebra", "Computer Science", "Biology", "English", "History"]
    data = []

    os.makedirs(output_dir, exist_ok=True)

    for user_id in range(n_users): 
        streak = 0
        current_difficulty = random.randint(1, 3)
        for q in range(n_questions_per_user):
            topic = random.choice(topics)
            questions_answered = q + 1

            avg_time_per_question = random.uniform(20, 60) * (1 + (current_difficulty - 1) * 0.15)

            prob_correct = 0.5 + 0.15 * (current_difficulty == 1) - 0.1 * (current_difficulty == 3)
            is_correct = random.random() < prob_correct

            streak = streak + 1 if is_correct else 0
            accuracy_rate = min(max((streak * 10) / (questions_answered * 10), 0), 1)

            if accuracy_rate > 0.85 and streak >= 2 and current_difficulty < 3:
                next_difficulty = current_difficulty + 1
            elif accuracy_rate < 0.5 and current_difficulty > 1:
                next_difficulty = current_difficulty - 1
            else:
                next_difficulty = current_difficulty

            data.append([
                user_id, topic, current_difficulty, accuracy_rate,
                streak, avg_time_per_question, questions_answered, next_difficulty
            ])

            current_difficulty = next_difficulty

    df = pd.DataFrame(data, columns=[
        "user_id", "topic", "current_difficulty", "accuracy_rate",
        "streak", "avg_time_per_question", "questions_answered", "next_difficulty"
    ])


    df.to_csv(os.path.join(output_dir, "synthetic_user_data.csv"), index=False)
    print(f"Synthetic dataset saved to {output_dir}/synthetic_user_data.csv")
    return df


if __name__ == "__main__":
    generate_synthetic_data()